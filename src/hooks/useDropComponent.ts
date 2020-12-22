import { useDrop, DropTargetMonitor } from 'react-dnd'
import { useSelector } from 'react-redux'
import { rootComponents } from '../utils/editor'
import useDispatch from './useDispatch'
import {
  getShowCustomComponentPage,
  getComponents,
  isChildrenOfCustomComponent,
  getSelectedPage,
  getCustomComponents,
} from '../core/selectors/components'
import { getCode, getAllComponentsCode } from '../core/selectors/code'
import babelQueries from '../babel-queries/queries'
import { searchRootCustomComponent } from '../utils/recursive'

export const useDropComponent = (
  componentId: string,
  accept: (ComponentType | MetaComponentType)[] = [...rootComponents],
  canDrop: boolean = true,
  boundingPosition?: {
    top: number
    bottom: number
  },
) => {
  const dispatch = useDispatch()
  const isCustomPage = useSelector(getShowCustomComponentPage)

  const components = useSelector(getComponents())
  const isCustomComponentChild = useSelector(
    isChildrenOfCustomComponent(componentId),
  )
  const code = useSelector(getCode)
  const selectedPage = useSelector(getSelectedPage)
  const customComponents = useSelector(getCustomComponents)
  const componentsCode = useSelector(getAllComponentsCode)
  let rootCustomParent: string = ``

  if (isCustomComponentChild) {
    rootCustomParent = searchRootCustomComponent(
      customComponents[componentId],
      customComponents,
    )
  }

  const updateStateAndCode = (
    code: string,
    updateInCustomComponent: boolean,
  ) => {
    const componentsState = babelQueries.getComponentsState(code)

    if (updateInCustomComponent) {
      dispatch.code.setComponentsCode(code, rootCustomParent)
      dispatch.components.updateCustomComponentsState(componentsState)
    } else {
      dispatch.code.setPageCode(code, selectedPage)
      dispatch.components.updateComponentsState(componentsState)
    }
  }

  const [{ isOver }, drop] = useDrop({
    accept: accept,
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }) && monitor.canDrop(),
    }),
    hover: (item: ComponentItemProps, monitor: DropTargetMonitor) => {
      if (item.isMoved && boundingPosition) {
        if (componentId === item.id) return
        if (components[item.id] === undefined) return

        const selectedComponent = components[item.id]
        if (selectedComponent.parent === 'Prop') return

        const { top, bottom } = boundingPosition
        const hoverMiddleY = (bottom - top) / 2
        const clientOffset = monitor.getClientOffset()
        const fromIndex = components[selectedComponent.parent].children.indexOf(
          item.id,
        )
        const toIndex = components[selectedComponent.parent].children.indexOf(
          componentId,
        )
        const hoverClientY = clientOffset && clientOffset.y - top

        if (toIndex === -1) return

        if (fromIndex === toIndex) return

        // check hasPassedMid
        if (fromIndex < toIndex && hoverClientY && hoverClientY < hoverMiddleY)
          return

        if (fromIndex > toIndex && hoverClientY && hoverClientY > hoverMiddleY)
          return

        const isCustomComponentUpdate =
          customComponents[selectedComponent.id] !== undefined ? true : false

        const updatedCode = babelQueries.reorderComponentChildren(
          isCustomComponentUpdate ? componentsCode[rootCustomParent] : code,
          {
            componentId: selectedComponent.parent,
            fromIndex,
            toIndex,
          },
        )
        if (updatedCode !== code) {
          updateStateAndCode(updatedCode, isCustomComponentUpdate)
        }
      }
    },
    canDrop: () => canDrop,
    drop: (item: ComponentItemProps, monitor: DropTargetMonitor) => {
      if (!monitor.isOver()) {
        return
      }
      if (isCustomComponentChild && !isCustomPage) return

      if (item.isMoved) {
        const updatedCode = babelQueries.moveComponent(code, {
          componentId: item.id,
          newParentId: componentId,
        })
        const componentsState = babelQueries.getComponentsState(updatedCode)
        dispatch.code.setPageCode(updatedCode, selectedPage)
        dispatch.components.updateComponentsState(componentsState)
      } else {
        let updatedCode: string = ``

        if (item.custom) {
          updatedCode = babelQueries.addCustomComponent(
            isCustomComponentChild ? componentsCode[rootCustomParent] : code,
            {
              parentId: componentId,
              type: item.id,
            },
          )
        } else {
          updatedCode = updatedCode = babelQueries.addComponent(
            isCustomComponentChild ? componentsCode[rootCustomParent] : code,
            {
              parentId: componentId,
              type: item.type,
            },
          )
        }
        updateStateAndCode(updatedCode, isCustomComponentChild)
      }
    },
  })

  return { drop, isOver }
}
