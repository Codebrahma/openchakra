import isBoolean from 'lodash/isBoolean'
import uniq from 'lodash/uniq'
// import { findChildrenImports } from './recursive'

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const formatCode = async (code: string) => {
  let formattedCode = `// 🚨 Your props contains invalid code`

  const prettier = await import('prettier/standalone')
  const babylonParser = await import('prettier/parser-babylon')

  try {
    formattedCode = prettier.format(code, {
      parser: 'babel',
      plugins: [babylonParser],
      semi: false,
      singleQuote: true,
    })
  } catch (e) {
    formattedCode = e.name + ': ' + e.message
  }

  return formattedCode
}

const buildBlock = (
  children: string[],
  components: IComponents,
  props: IProp[],
) => {
  let content = ''

  children.forEach((key: string) => {
    let childComponent = components[key]
    if (!childComponent) {
      console.error(`invalid component ${key}`)
    } else {
      const componentName = capitalize(childComponent.type)
      let propsContent = ''

      props
        .filter(prop => prop.componentId === childComponent.id)
        .forEach((prop: IProp) => {
          const propsValue = prop.value
          const propName = prop.name
          if (propsValue || prop.derivedFromPropName) {
            let operand = `='${propsValue}'`

            if (propName !== 'children') {
              if (prop.derivedFromPropName) {
                operand = `={${prop.derivedFromPropName}}`
              } else {
                if (
                  propsValue === true ||
                  propsValue === 'true' ||
                  propsValue === 'false' ||
                  isBoolean(propsValue)
                ) {
                  operand = ``
                }
              }
              propsContent += `${propName}${operand} `
            }
          }
        })
      const childrenProp = props.find(
        prop =>
          prop.componentId === childComponent.id && prop.name === 'children',
      )
      const children = childComponent.children

      if (typeof childrenProp?.value === 'string' && children.length === 0) {
        if (childrenProp.derivedFromPropName) {
          content += `<${componentName} ${propsContent}>{${childrenProp.derivedFromPropName}}</${componentName}>`
        } else {
          content += `<${componentName} ${propsContent}>${childrenProp.value}</${componentName}>`
        }
      } else if (
        childrenProp &&
        Array.isArray(childrenProp?.value) &&
        children.length
      ) {
        let childrenValue = ''
        childrenProp.value.forEach((child: string) => {
          if (components[child]) {
            childrenValue =
              childrenValue + buildBlock([child], components, props)
          } else {
            childrenValue = childrenValue + child
          }
        })

        content += `<${componentName} ${propsContent}>
        ${childrenValue}
        </${componentName}>`
      } else if (children.length) {
        content += `<${componentName} ${propsContent}>
      ${buildBlock(childComponent.children, components, props)}
      </${componentName}>`
      } else {
        content += `<${componentName} ${propsContent} />`
      }
    }
  })

  return content
}

export const generateComponentCode = async (
  component: IComponent,
  components: IComponents,
  props: IProp[],
) => {
  let code = buildBlock(component.children, components, props)

  code = `
  const My${component.type} = () => (
    ${code}
  )`
  return await formatCode(code)
}

//object to string
function objToString(obj: any, key: string = 'theme') {
  let str = ''
  for (const p in obj) {
    if (typeof obj[p] === 'object')
      str +=
        p +
        `:{\n...${key}.${p}` +
        ',\n' +
        objToString(obj[p], `${key}.${p}`) +
        '},\n'
    else str += p + ': "' + obj[p] + '",\n'
  }
  return str
}

export const generateCode = async (
  components: IComponents,
  customComponents: IComponents,
  customComponentsList: string[],
  props: IProp[],
  customComponentsProps: IProp[],
  customTheme: any,
) => {
  const checkInstanceInComponents = (componentType: string) => {
    let isPresent = false
    Object.values(components).forEach(component => {
      if (component.type === componentType) isPresent = true
    })
    Object.values(customComponents).forEach(component => {
      if (component.type === componentType && component.id !== componentType)
        isPresent = true
    })
    return isPresent
  }

  const getUsedCustomComponents = () => {
    const usedCustomComponentsList: string[] = []
    const getUsedCustomComponentsRecursive = (id: string) => {
      const type = customComponents[id].type
      if (
        customComponentsList.includes(type) &&
        usedCustomComponentsList.indexOf(type) === -1
      ) {
        usedCustomComponentsList.push(type)
        getUsedCustomComponentsRecursive(type)
      }
      customComponents[id].children.forEach(child =>
        getUsedCustomComponentsRecursive(child),
      )
    }
    Object.values(components)
      .filter(component => customComponentsList.includes(component.type))
      .forEach(component => getUsedCustomComponentsRecursive(component.type))
    return usedCustomComponentsList
  }

  const getImportsFromCustomComponents = () => {
    const requiredImports: string[] = []
    const getImportsFromCustomComponentsRecursive = (comp: IComponent) => {
      if (customComponentsList.indexOf(comp.type) === -1)
        requiredImports.push(comp.type)

      comp.children.forEach(child =>
        getImportsFromCustomComponentsRecursive(customComponents[child]),
      )
    }
    usedCustomComponentsList.forEach(name => {
      getImportsFromCustomComponentsRecursive(customComponents[name])
    })
    return requiredImports
  }

  let code = buildBlock(components.root.children, components, props)
  const customThemeCode = `const customTheme={
    ...theme,
    ${objToString(customTheme)}
  }`
  const theme = customTheme ? `customTheme` : `theme`

  //Find what are the custom components used.
  const usedCustomComponentsList = getUsedCustomComponents()

  //Generate the code for custom components
  const customComponentCode =
    usedCustomComponentsList &&
    Object.values(usedCustomComponentsList).map(componentName => {
      //Display custom component only if the custom component instance is present
      const customComponentInstance = checkInstanceInComponents(componentName)
      if (customComponentInstance) {
        const customComponentProps = customComponentsProps
          .filter(prop => prop.componentId === componentName)
          .map(prop => `${prop.name}`)

        const componentCode = buildBlock(
          customComponents[componentName].children,
          customComponents,
          customComponentsProps,
        )
        return `const ${capitalize(componentName)} = (${
          customComponentProps.length > 0
            ? '{' + customComponentProps.join(',') + '}'
            : ' '
        }) =>(
          ${componentCode}
       );
       `
      } else return null
    })

  //filter the custom components types
  let imports = [
    ...new Set(
      Object.keys(components)
        .filter(name => name !== 'root')
        .filter(
          name => customComponentsList.indexOf(components[name].type) === -1,
        )
        .map(name => components[name].type),
    ),
    ...getImportsFromCustomComponents(),
  ]
  //remove duplicates from the imports array.
  imports = uniq(imports)

  code = `import React from 'react';
  import {
    ThemeProvider,
    CSSReset,
    theme,
    ${imports.join(',')}
  } from "@chakra-ui/core";

  ${customComponentCode && customComponentCode.join('')}
  const App = () => {
    ${customTheme ? customThemeCode : ''}
    return(
    <ThemeProvider theme={${theme}}>
      <CSSReset />
      ${code}
    </ThemeProvider>
    )
  };

  export default App;`
  return await formatCode(code)
}
