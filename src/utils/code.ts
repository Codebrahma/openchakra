import isBoolean from 'lodash/isBoolean'
import uniq from 'lodash/uniq'

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
      const propsRef = childComponent.propRefs

      propsRef &&
        Object.values(propsRef).forEach(prop => {
          if (prop.targetedProp !== 'children')
            propsContent += `${prop.targetedProp}={${prop.customPropName}}`
        })

      propsNames.forEach((propName: string) => {
        const propsValue = childComponent.props[propName]

        if (propName !== 'children') {
          if (propsRef === undefined || propsRef[propName] === undefined) {
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
        if (propsRef && propsRef['children']) {
          content += `<${componentName} ${propsContent}>{${propsRef['children'].customPropName}}</${componentName}>`
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

  const customComponentCode =
    customComponentsList &&
    Object.values(customComponentsList).map(componentName => {
      const showProps = Object.keys(customComponents[componentName].props).map(
        prop => `${prop}`,
      )

      const componentCode = buildBlock(
        customComponents[componentName],
        customComponents,
      )
      return `const ${capitalize(componentName)} = (${
        showProps.length > 0 ? '{' + showProps.join(',') + '}' : ' '
      }) =>(
        ${componentCode}
     );
     `
    })

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
      Object.keys(customComponents)
        .filter(name => name !== 'root')
        .filter(
          name =>
            customComponentsList.indexOf(customComponents[name].type) === -1,
        )
        .map(name => customComponents[name].type),
    ),
  ]
  //remove duplicates from the imports arrray.
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
