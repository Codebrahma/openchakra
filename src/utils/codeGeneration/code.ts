import uniq from 'lodash/uniq'
import { buildBlock, capitalize } from './buildBlock'
import formatCode from './formatCode'
import getImportFormatForIcons from './getImportFormatForIcons'

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
      str += p + `:{` + objToString(obj[p], `${key}.${p}`) + '},\n'
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

  const customThemeCode = `const theme = extendTheme({${objToString(
    customTheme,
  )}
  })`

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
  let componentsImports = [
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
  //remove duplicates from the componentsImports array.
  componentsImports = uniq(componentsImports)

  const {
    chakraIconsImport,
    fontAwesomeIconsImport,
    materialIconsImport,
    antIconsImport,
  } = getImportFormatForIcons(components, props)

  code = `import React from 'react';
  import {
    ChakraProvider,
    ${customTheme ? 'extendTheme,' : 'theme,'}
    ${componentsImports.join(',')}
  } from "@chakra-ui/core";

  ${chakraIconsImport}
  ${fontAwesomeIconsImport}
  ${materialIconsImport}
  ${antIconsImport}
  
  ${customComponentCode && customComponentCode.join('')}
  const App = () => {
    ${customTheme ? customThemeCode : ''}
    return(
    <ChakraProvider resetCSS theme={theme}>
      ${code}
    </ChakraProvider>
    )
  };

  export default App;`
  return await formatCode(code)
}
