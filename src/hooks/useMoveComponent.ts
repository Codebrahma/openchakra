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
import { useQueue } from './useQueue'

const useMoveComponent = (parentId: string) => {
  const dispatch = useDispatch()
  const queue = useQueue()

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
    // component moved inside custom component
    if (!isCustomComponentChild) {
      const updatedCode = babelQueries.moveComponent(code, {
        componentId,
        destParentId: parentId,
      })
      dispatch.code.setPageCode(updatedCode, selectedPage)
    }
    // component moved inside custom component
    else {
      const updatedCode = babelQueries.moveComponent(
        componentsCode[rootParentOfParentElement],
        {
          componentId,
          destParentId: parentId,
        },
      )
      dispatch.code.setComponentsCode(updatedCode, rootParentOfParentElement)
    }
  }

  const onComponentMove = (componentId: string) => {
    const oldParentId =
      customComponents[componentId] !== undefined
        ? customComponents[componentId].parent
        : components[componentId].parent

    // Only if the parent changes, the component should be moved or else the component should just be reordered.
    if (oldParentId !== parentId && parentId !== componentId) {
      dispatch.components.moveComponent({
        componentId,
        parentId,
      })

      queue.enqueue(async () => {
        moveComponentBabelQueryHandler(componentId)
      })
    }
  }
  return onComponentMove
}

export default useMoveComponent
