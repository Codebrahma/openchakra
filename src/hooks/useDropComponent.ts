import { useDrop, DropTargetMonitor } from 'react-dnd'
import { useSelector } from 'react-redux'
import { rootComponents } from '../utils/editor'
import useDispatch from './useDispatch'
import {
  getShowCustomComponentPage,
  getComponents,
  isChildrenOfCustomComponent,
  getSelectedPage,
} from '../core/selectors/components'
import { getCode } from '../core/selectors/code'
import babelQueries from '../babel-queries/queries'

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

        dispatch.components.moveSelectedComponentChildren({
          componentId: selectedComponent.parent,
          fromIndex,
          toIndex: toIndex === -1 ? fromIndex : toIndex,
        })
        const updatedCode = babelQueries.reorderComponentChildren(code, {
          componentId: selectedComponent.parent,
          fromIndex,
          toIndex: toIndex === -1 ? fromIndex : toIndex,
        })
        dispatch.code.setCode(updatedCode, selectedPage)
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
        dispatch.code.setCode(updatedCode, selectedPage)
        dispatch.components.updateComponentsState(componentsState)
      } else {
        let updatedCode: string = ``

        if (item.custom) {
          updatedCode = babelQueries.addCustomComponent(code, {
            parentId: componentId,
            type: item.id,
          })
        } else {
          updatedCode = babelQueries.addComponent(code, {
            parentId: componentId,
            type: item.type,
          })
        }
        const componentsState = babelQueries.getComponentsState(updatedCode)
        dispatch.code.setCode(updatedCode, selectedPage)
        dispatch.components.updateComponentsState(componentsState)
        dispatch.components.unselect()
      }
    },
  })

  return { drop, isOver }
}
