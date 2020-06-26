import isBoolean from 'lodash/isBoolean'
import uniq from 'lodash/uniq'
import { findChildrenImports } from './recursive'

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
  } catch (e) {}

  return formattedCode
}

const buildBlock = (component: IComponent, components: IComponents) => {
  let content = ''

  component.children.forEach((key: string) => {
    let childComponent = components[key]
    if (!childComponent) {
      console.error(`invalid component ${key}`)
    } else {
      const componentName = capitalize(childComponent.type)
      let propsContent = ''

      const propsNames = Object.keys(childComponent.props)
      const exposedProps = childComponent.exposedProps

      exposedProps &&
        Object.values(exposedProps).forEach(prop => {
          if (prop.targetedProp !== 'children')
            propsContent += `${prop.targetedProp}={${prop.customPropName}}`
        })

      propsNames.forEach((propName: string) => {
        const propsValue = childComponent.props[propName]

        if (propName !== 'children') {
          if (
            (exposedProps === undefined ||
              exposedProps[propName] === undefined) &&
            propsValue.length > 0
          ) {
            let operand = `='${propsValue}'`
            if (propsValue === true || propsValue === 'true') {
              operand = ``
            } else if (
              propsValue === 'false' ||
              isBoolean(propsValue) ||
              !isNaN(propsValue)
            ) {
              operand = `={${propsValue}}`
            }

            propsContent += `${propName}${operand} `
          }
        }
      })
      if (
        typeof childComponent.props.children === 'string' &&
        childComponent.children.length === 0
      ) {
        if (exposedProps && exposedProps['children']) {
          content += `<${componentName} ${propsContent}>{${exposedProps['children'].customPropName}}</${componentName}>`
        } else {
          content += `<${componentName} ${propsContent}>${childComponent.props.children}</${componentName}>`
        }
      } else if (childComponent.children.length) {
        content += `<${componentName} ${propsContent}>
      ${buildBlock(childComponent, components)}
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
) => {
  let code = buildBlock(component, components)

  code = `
const My${component.type} = () => (
  ${code}
)`

  return await formatCode(code)
}

export const generateCode = async (
  components: IComponents,
  customComponents: IComponents,
  customComponentsList: string[],
) => {
  let code = buildBlock(components.root, components)

  const checkInstanceInComponents = (componentType: string) => {
    let isPresent = false
    Object.values(components).forEach(component => {
      if (component.type === componentType) isPresent = true
    })
    Object.values(customComponents).forEach(component => {
      if (component.type === componentType) isPresent = true
    })
    return isPresent
  }

  const customComponentCode =
    customComponentsList &&
    Object.values(customComponentsList).map(componentName => {
      //Display custom component only if the custom component instance is present
      const customComponentInstance = checkInstanceInComponents(componentName)
      if (customComponentInstance) {
        const customComponentProps = Object.keys(
          customComponents[componentName].props,
        ).map(prop => `${prop}`)

        const componentCode = buildBlock(
          customComponents[componentName],
          customComponents,
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

  //only import the chakra-ui components from the custom components if the instance is present in the page.
  let customComponentImports: Array<string> = []
  customComponentsList.forEach(type => {
    if (checkInstanceInComponents(type)) {
      customComponentImports = [
        ...customComponentImports,
        ...findChildrenImports(customComponents[type], customComponents),
      ]
    }
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
    ...new Set(
      customComponentImports.filter(
        name => customComponentsList.indexOf(name) === -1,
      ),
    ),
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
const App = () => (
  <ThemeProvider theme={theme}>
    <CSSReset />
    ${code}
  </ThemeProvider>
);

export default App;`

  return await formatCode(code)
}
