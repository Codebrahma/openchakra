import difference from 'lodash/difference'
import * as t from '@babel/types'
import traverse from '@babel/traverse'
import { IComponentsUsed } from '../get-used-components'

// Check if the component is used in the code more than once.
const checkIsComponentUsed = (path: any, componentName: string) => {
  let compInstanceCount = 0

  traverse(
    path.node,
    {
      JSXOpeningElement(path: any) {
        if (path.node.name.name === componentName)
          compInstanceCount = compInstanceCount + 1
      },
    },
    path.scope,
    path.state,
    path,
  )
  return compInstanceCount > 1 ? true : false
}

const removeSpecifiedImports = (
  path: any,
  componentsToRemove: IComponentsUsed,
) => {
  const importSourceValue = path.node.source.value
  if (importSourceValue === '@chakra-ui/core') {
    const importedComponents = path.node.specifiers.map(
      (specifier: any) => specifier.local.name,
    )

    // Example lets have a box. Box contains button and text.
    //First the box will be checked throughout the code, only if there is no other box component, only then the box is deleted.
    //The same goes for button and text component.
    const filteredComponentNames = componentsToRemove.chakraComponents.filter(
      componentName => {
        if (checkIsComponentUsed(path.parentPath, componentName)) return null
        else return componentName
      },
    )

    // Remove the components that are used from the imported components
    const updatedImports = difference(
      importedComponents,
      filteredComponentNames,
    )

    path.node.specifiers = updatedImports.map(component =>
      t.importSpecifier(t.identifier(component), t.identifier(component)),
    )
  }

  // If it is a custom component, remove the component
  if (importSourceValue.startsWith('./components/')) {
    const customComponentName = path.node.specifiers[0].local.name
    if (
      componentsToRemove.customComponents.includes(customComponentName) &&
      !checkIsComponentUsed(path.parentPath, customComponentName)
    ) {
      path.remove()
    }
  }
}

export default removeSpecifiedImports
