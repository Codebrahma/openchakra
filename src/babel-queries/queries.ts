import { transform } from '@babel/standalone'
import babelPluginSyntaxJsx from '@babel/plugin-syntax-jsx'
import BabelPluginGetComponents from '../babel-plugins/get-components-plugin/get-components'
import BabelPluginSetProp from '../babel-plugins/set-prop-plugin'
import BabelSetComponentId from '../babel-plugins/set-componentId-plugin'
import BabelRemoveComponentId from '../babel-plugins/remove-componentId-plugin'
import BabelDeleteComponent from '../babel-plugins/delete-component-plugin'
import BabelDuplicateComponent from '../babel-plugins/duplicate-component-plugin'
import BabelAddComponent from '../babel-plugins/add-component-plugin'
import BabelReorderChildren from '../babel-plugins/reorder-children-plugin'
import BabelAddComponentImports from '../babel-plugins/add-imports-plugin'
import BabelSaveComponent from '../babel-plugins/save-component-plugin'
import BabelAddCustomComponent from '../babel-plugins/add-custom-component-plugin'
import BabelAddProps from '../babel-plugins/add-props-plugin'
import BabelDeleteProp from '../babel-plugins/delete-prop-plugin'
import BabelRemoveMovedComponentFromSource from '../babel-plugins/move-component-plugin/remove-component'
import BabelInsertMovedComponentToDest from '../babel-plugins/move-component-plugin/insert-moved-component-plugin'
import BabelAddMetaComponent from '../babel-plugins/add-meta-component-plugin'
import BabelReassignComponentId from '../babel-plugins/reassign-componentId'
import BabelExposeProp from '../babel-plugins/expose-prop-plugin'
import BabelAddPropInAllInstances from '../babel-plugins/add-prop-in-all-instances'
import BabelUnExposeProp from '../babel-plugins/unexpose-prop-plugin'
import BabelDeleteInAllInstances from '../babel-plugins/delete-prop-in-all-instances'
import BabelDeleteCustomProp from '../babel-plugins/delete-custom-prop-plugin'
import BabelSetChildrenProp, {
  ISpanComponentsValues,
} from '../babel-plugins/set-children-prop-plugin'
import BabelConvertInstancesToContainerCompoenent from '../babel-plugins/convert-instances-to-container-component'
import BabelConvertInstancesToNormalComponent from '../babel-plugins/convert-instances-to-normal-component'
import BabelDeleteCustomChildrenProp from '../babel-plugins/delete-custom-children-prop'

const getComponentsState = (code: string) => {
  const plugin = new BabelPluginGetComponents()

  transform(code, {
    plugins: [babelPluginSyntaxJsx, plugin.plugin],
  })

  return plugin.state
}

const setProp = (
  code: string,
  options: { componentId: string; propName: string; value: string },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelPluginSetProp, options]],
  }).code
}

const setIdToComponents = (code: string) => {
  const transformed = transform(code, {
    plugins: [babelPluginSyntaxJsx, BabelSetComponentId],
  })
  return transformed.code
}

const removeComponentId = (code: string) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, BabelRemoveComponentId],
  }).code
}

const deleteComponent = (code: string, options: { componentId: string }) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelDeleteComponent, options]],
  }).code
}

const duplicateComponent = (
  code: string,
  options: { componentId: string; componentIds: string[] },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelDuplicateComponent, options]],
  }).code
}

const addComponent = (
  code: string,
  options: { componentId: string; parentId: string; type: string },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelAddComponent, options]],
  }).code
}

const reorderComponentChildren = (
  code: string,
  options: {
    componentId: string
    fromIndex: number
    toIndex: number
  },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelReorderChildren, options]],
  }).code
}

const addComponentImports = (
  code: string,
  options: { components: string[] },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelAddComponentImports, options]],
  }).code
}

// Here two babel plugins are used.
// One plugin is used to remove the specified component from its parent and it will return the removed component.
// Another plugin is used to insert the removed component in its new component
const moveComponent = (
  sourceCode: string,
  destinationCode: string,
  options: { componentId: string; destParentId: string },
) => {
  const plugin = new BabelRemoveMovedComponentFromSource({
    componentId: options.componentId,
  })

  const transformedSource = transform(sourceCode, {
    plugins: [babelPluginSyntaxJsx, plugin.plugin],
  })

  // If the source and destination code is same, the transformed code from the source is used here.
  // Because we need to perform both remove component from old parent and insert component in new parent in same code
  const transformedDest = transform(
    sourceCode === destinationCode ? transformedSource.code : destinationCode,
    {
      plugins: [
        babelPluginSyntaxJsx,
        [
          BabelInsertMovedComponentToDest,
          {
            parentId: options.destParentId,
            componentToInsert: plugin.removedComponent,
          },
        ],
      ],
    },
  )

  return {
    updatedSourceCode: transformedSource.code,
    updatedDestCode: transformedDest.code,
  }
}

const saveComponent = (
  code: string,
  options: {
    componentId: string
    customComponentName: string
    exposedProps: IProp[]
    componentInstanceId: string
  },
) => {
  const plugin = new BabelSaveComponent(options)

  const transformed = transform(code, {
    plugins: [babelPluginSyntaxJsx, plugin.plugin],
  })
  return {
    updatedCode: transformed.code,
    customComponentCode: plugin.functionalComponentCode,
  }
}

const addCustomComponent = (
  code: string,
  options: {
    componentId: string
    parentId: string
    type: string
    defaultProps: IProp[]
    isContainerComponent: boolean
  },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelAddCustomComponent, options]],
  }).code
}

const addProps = (
  code: string,
  options: { componentId: string; propsToBeAdded: any },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelAddProps, options]],
  }).code
}

const deleteProp = (
  code: string,
  options: { componentId: string; propName: string },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelDeleteProp, options]],
  }).code
}

const addMetaComponent = (
  code: string,
  options: { componentIds: string[]; parentId: string; type: string },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelAddMetaComponent, options]],
  }).code
}
const exportToCustomComponentsPage = (
  pageCode: string,
  customComponentsPageCode: string,
  options: { componentId: string; componentIds: string[] },
) => {
  // First the component is fetched from the Page code source.
  const plugin = new BabelRemoveMovedComponentFromSource({
    componentId: options.componentId,
  })

  transform(pageCode, {
    plugins: [babelPluginSyntaxJsx, plugin.plugin],
  })

  // The component-id's for the components are reassigned.
  const modifiedComponentCode = transform(plugin.removedComponent, {
    plugins: [
      babelPluginSyntaxJsx,
      [BabelReassignComponentId, { componentIds: options.componentIds }],
    ],
  }).code

  // The component code with the reassigned componentIds are added as the children to the root of the custom components page.
  const updatedCustomComponentsCode = transform(customComponentsPageCode, {
    plugins: [
      babelPluginSyntaxJsx,
      [
        BabelInsertMovedComponentToDest,
        {
          parentId: 'root',
          componentToInsert: modifiedComponentCode,
        },
      ],
    ],
  }).code

  return updatedCustomComponentsCode
}

const exposeProp = (
  code: string,
  options: {
    componentId: string
    propName: string
    targetedPropName: string
  },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelExposeProp, options]],
  }).code
}

const addPropInAllInstances = (
  pagesCode: ICode,
  options: {
    propName: string
    propValue: string
    componentName: string
    boxId?: string
  },
) => {
  const updatedPagesCode = { ...pagesCode }

  if (options.componentName.length > 0) {
    // Remove the custom prop from all the instances of the component.
    Object.keys(updatedPagesCode).forEach(pageName => {
      const code = updatedPagesCode[pageName]
      updatedPagesCode[pageName] = transform(code, {
        plugins: [babelPluginSyntaxJsx, [BabelAddPropInAllInstances, options]],
      }).code
    })
  }
  return updatedPagesCode
}

const exposePropAndUpdateInstances = (
  code: string,
  pagesCode: ICode,
  options: {
    customComponentName: string
    componentId: string
    propName: string
    targetedPropName: string
    defaultPropValue: string
    boxId?: string
  },
) => {
  const {
    customComponentName,
    propName,
    defaultPropValue,
    boxId,
    componentId,
    targetedPropName,
  } = options

  const updatedCode = exposeProp(code, {
    componentId,
    propName,
    targetedPropName,
  })

  const updatedPagesCode = addPropInAllInstances(pagesCode, {
    propName,
    propValue: defaultPropValue,
    componentName: customComponentName,
    boxId,
  })

  return {
    updatedCode: updatedCode,
    updatedPagesCode: updatedPagesCode,
  }
}

// Convert the instances of normal custom component to container custom component
const convertInstancesToContainerComp = (
  pagesCode: ICode,
  options: { componentName: string },
) => {
  const { componentName } = options
  const updatedPagesCode = { ...pagesCode }

  if (componentName.length > 0) {
    // Remove the custom prop from all the instances of the component.
    Object.keys(updatedPagesCode).forEach(pageName => {
      const code = updatedPagesCode[pageName]
      updatedPagesCode[pageName] = transform(code, {
        plugins: [
          babelPluginSyntaxJsx,
          [
            BabelConvertInstancesToContainerCompoenent,
            {
              componentName,
            },
          ],
        ],
      }).code
    })
  }
  return updatedPagesCode
}

// Convert the instances of container custom component to normal custom component
const convertInstancesToNormalComp = (
  pagesCode: ICode,
  options: { componentName: string },
) => {
  const { componentName } = options
  const updatedPagesCode = { ...pagesCode }

  if (componentName.length > 0) {
    // Remove the custom prop from all the instances of the component.
    Object.keys(updatedPagesCode).forEach(pageName => {
      const code = updatedPagesCode[pageName]
      updatedPagesCode[pageName] = transform(code, {
        plugins: [
          babelPluginSyntaxJsx,
          [
            BabelConvertInstancesToNormalComponent,
            {
              componentName,
            },
          ],
        ],
      }).code
    })
  }
  return updatedPagesCode
}

const deletePropInAllInstances = (
  pagesCode: ICode,
  options: {
    componentName: string
    propName: string
  },
) => {
  const updatedPagesCode = { ...pagesCode }

  // Only update the instances of the custom component, if the exposed prop present in custom component.
  if (options.componentName.length > 0) {
    Object.keys(updatedPagesCode).forEach(pageName => {
      const code = updatedPagesCode[pageName]
      updatedPagesCode[pageName] = transform(code, {
        plugins: [babelPluginSyntaxJsx, [BabelDeleteInAllInstances, options]],
      }).code
    })
  }
  return updatedPagesCode
}

const unExposeProp = (
  code: string,
  options: {
    componentId: string
    exposedPropName: string
    exposedPropValue: string
    customPropName: string
  },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelUnExposeProp, options]],
  }).code
}

const unExposePropAndUpdateInstances = (
  code: string,
  pagesCode: ICode,
  options: {
    customComponentName: string
    componentId: string
    customPropName: string
    exposedPropName: string
    exposedPropValue: string
  },
) => {
  // Modify the component code.
  const transformedCode = unExposeProp(code, options)

  // Remove the custom prop from all the instances of the component.
  const updatedPagesCode = deletePropInAllInstances(pagesCode, {
    componentName: options.customComponentName,
    propName: options.customPropName,
  })

  return {
    updatedPagesCode,
    updatedCode: transformedCode,
  }
}

const deleteCustomChildrenProp = (componentCode: string) => {
  return transform(componentCode, {
    plugins: [babelPluginSyntaxJsx, BabelDeleteCustomChildrenProp],
  }).code
}

// We are passing the props that use custom prop as attribute
// Because the code does not hold the initial value before exposed
// To replace the exposed prop with the old initial value, we are passing the props that use custom prop.
const deleteCustomProp = (
  componentCode: string,
  pagesCode: ICode,
  options: {
    customComponentName: string
    customPropName: string
    propsUsingCustomProp: IProps
  },
) => {
  // Modify the component code.
  const transformedComponentCode = transform(componentCode, {
    plugins: [babelPluginSyntaxJsx, [BabelDeleteCustomProp, options]],
  }).code

  // Remove the custom prop from all the instances of the component.
  const updatedPagesCode = deletePropInAllInstances(pagesCode, {
    componentName: options.customComponentName,
    propName: options.customPropName,
  })

  return {
    updatedPagesCode,
    updatedCode: transformedComponentCode,
  }
}

const setChildrenProp = (
  code: string,
  options: {
    componentId: string
    value: string[]
    spanComponentsValues: ISpanComponentsValues
  },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelSetChildrenProp, options]],
  }).code
}

export default {
  getComponentsState,
  setProp,
  setIdToComponents,
  removeComponentId,
  deleteComponent,
  duplicateComponent,
  addComponent,
  reorderComponentChildren,
  addComponentImports,
  moveComponent,
  saveComponent,
  addCustomComponent,
  addProps,
  deleteProp,
  addMetaComponent,
  exportToCustomComponentsPage,
  exposePropAndUpdateInstances,
  unExposePropAndUpdateInstances,
  deleteCustomProp,
  setChildrenProp,
  convertInstancesToContainerComp,
  convertInstancesToNormalComp,
  exposeProp,
  unExposeProp,
  deleteCustomChildrenProp,
}
