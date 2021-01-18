import { useSelector } from 'react-redux'

import useDispatch from './useDispatch'
import babelQueries from '../babel-queries/queries'
import { searchRootCustomComponent } from '../utils/recursive'
import {
  isChildrenOfCustomComponent,
  getCustomComponents,
  getSelectedPageComponents,
} from '../core/selectors/components'
import { getCode, getAllComponentsCode } from '../core/selectors/code'
import { getSelectedPage } from '../core/selectors/page'

const useMoveComponent = (parentId: string) => {
  const dispatch = useDispatch()
  const isCustomComponentChild = useSelector(
    isChildrenOfCustomComponent(parentId),
  )
  const customComponents = useSelector(getCustomComponents)
  const components = useSelector(getSelectedPageComponents)
  const code = useSelector(getCode)
  const selectedPage = useSelector(getSelectedPage)
  const componentsCode = useSelector(getAllComponentsCode)

  let rootParentOfParentElement: string = ``

  if (isCustomComponentChild) {
    rootParentOfParentElement = searchRootCustomComponent(
      customComponents[parentId],
      customComponents,
    )
  }

  const moveComponentBabelQueryHandler = (componentId: string) => {
    const isCustomComponentUpdate = customComponents[componentId] ? true : false
    const isParentCustomComponent = isCustomComponentChild

    let rootParentOfComponent = ``
    if (isCustomComponentUpdate) {
      rootParentOfComponent = searchRootCustomComponent(
        customComponents[componentId],
        customComponents,
      )
    }

    // If the component is dragged into the same custom component.
    if (
      rootParentOfComponent !== '' &&
      rootParentOfComponent === rootParentOfParentElement
    )
      return

    // Normal component moved from normal component to another normal component
    if (!isCustomComponentUpdate && !isParentCustomComponent) {
      const { updatedDestCode } = babelQueries.moveComponent(code, code, {
        componentId,
        destParentId: parentId,
      })
      dispatch.code.setPageCode(updatedDestCode, selectedPage)
    }
    // Normal Component moved from normal component to custom component
    else if (!isCustomComponentUpdate && isParentCustomComponent) {
      const { updatedSourceCode, updatedDestCode } = babelQueries.moveComponent(
        code,
        componentsCode[rootParentOfParentElement],
        {
          componentId,
          destParentId: parentId,
        },
      )
      dispatch.code.setPageCode(updatedSourceCode, selectedPage)

      dispatch.code.setComponentsCode(
        updatedDestCode,
        rootParentOfParentElement,
      )
    }
    // Custom component moved from custom component to normal component
    else if (isCustomComponentUpdate && !isParentCustomComponent) {
      const { updatedSourceCode, updatedDestCode } = babelQueries.moveComponent(
        componentsCode[rootParentOfComponent],
        code,
        {
          componentId,
          destParentId: parentId,
        },
      )
      dispatch.code.setComponentsCode(updatedSourceCode, rootParentOfComponent)

      dispatch.code.setPageCode(updatedDestCode, selectedPage)
    }
    // custom component moved from custom component to another custom component
    else {
      const { updatedSourceCode, updatedDestCode } = babelQueries.moveComponent(
        componentsCode[rootParentOfComponent],
        componentsCode[rootParentOfParentElement],
        {
          componentId,
          destParentId: parentId,
        },
      )
      dispatch.code.setComponentsCode(updatedSourceCode, rootParentOfComponent)
      dispatch.code.setComponentsCode(
        updatedDestCode,
        rootParentOfParentElement,
      )
    }
  }

  const onComponentMove = (componentId: string) => {
    const oldParentId =
      customComponents[componentId] !== undefined
        ? customComponents[componentId].parent
        : components[componentId].parent

    // Only if the parent changes, the component should be moved or else the component should just be reordered.
    if (oldParentId !== parentId) {
      dispatch.components.moveComponent({
        componentId,
        parentId,
      })

      setTimeout(() => {
        moveComponentBabelQueryHandler(componentId)
      }, 200)
    }
  }
  return onComponentMove
}

export default useMoveComponent
