import { transform } from '@babel/standalone'
import babelPluginSyntaxJsx from '@babel/plugin-syntax-jsx'

import BabelDeleteCustomChildrenProp from '../babel-plugins/delete-custom-children-prop'
import BabelSaveComponent from '../babel-plugins/save-component-plugin'
import BabelAddCustomComponent from '../babel-plugins/add-custom-component-plugin'
import BabelExposeProp from '../babel-plugins/expose-prop-plugin'
import BabelAddPropInAllInstances from '../babel-plugins/add-prop-in-all-instances'
import BabelUnExposeProp from '../babel-plugins/unexpose-prop-plugin'
import BabelDeleteInAllInstances from '../babel-plugins/delete-prop-in-all-instances'
import BabelDeleteCustomProp from '../babel-plugins/delete-custom-prop-plugin'
import { getComponentsUsed, getComponent } from './components-operations'

export const saveComponent = (
  code: string,
  options: {
    componentId: string
    customComponentName: string
    exposedProps: IProp[]
    componentInstanceId: string
  },
) => {
  const componentCode = getComponent(code, options)
  const componentsUsed = getComponentsUsed(componentCode)

  const plugin = new BabelSaveComponent({ ...options, componentsUsed })

  const transformed = transform(code, {
    plugins: [babelPluginSyntaxJsx, plugin.plugin],
  })
  return {
    updatedCode: transformed.code,
    customComponentCode: plugin.functionalComponentCode,
  }
}

export const addCustomComponent = (
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

export const exposeProp = (
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

export const addPropInAllInstances = (
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
    Object.keys(updatedPagesCode).forEach(pageName => {
      const code = updatedPagesCode[pageName]
      updatedPagesCode[pageName] = transform(code, {
        plugins: [babelPluginSyntaxJsx, [BabelAddPropInAllInstances, options]],
      }).code
    })
  }
  return updatedPagesCode
}

export const exposePropAndUpdateInstances = (
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

export const deletePropInAllInstances = (
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

export const unExposeProp = (
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

export const unExposePropAndUpdateInstances = (
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

export const deleteCustomChildrenProp = (componentCode: string) => {
  return transform(componentCode, {
    plugins: [babelPluginSyntaxJsx, BabelDeleteCustomChildrenProp],
  }).code
}

// We are passing the props that use custom prop as attribute
// Because the code does not hold the initial value before exposed
// To replace the exposed prop with the old initial value, we are passing the props that use custom prop.
export const deleteCustomProp = (
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
