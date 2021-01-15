import { transform } from '@babel/standalone'
import babelPluginSyntaxJsx from '@babel/plugin-syntax-jsx'

import BabelConvertInstancesToContainerCompoenent from '../babel-plugins/convert-instances-to-container-component'
import BabelConvertInstancesToNormalComponent from '../babel-plugins/convert-instances-to-normal-component'

// Convert the instances of normal custom component to container custom component
export const convertInstancesToContainerComp = (
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
export const convertInstancesToNormalComp = (
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
