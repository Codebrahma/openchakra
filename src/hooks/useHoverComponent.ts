import { useDrop, DropTargetMonitor } from 'react-dnd'
import { useSelector } from 'react-redux'
import { rootComponents } from '../utils/editor'
import useDispatch from './useDispatch'
import {
  getComponents,
  isChildrenOfCustomComponent,
  getCustomComponents,
} from '../core/selectors/components'

export const useHoverComponent = (
  componentId: string,
  boundingPosition?: {
    top: number
    bottom: number
  },
  accept: (ComponentType | MetaComponentType)[] = rootComponents,
) => {
  const dispatch = useDispatch()
  const isCustomComponentChild = useSelector(
    isChildrenOfCustomComponent(componentId),
  )
  const components = useSelector(getComponents)
  const customComponents = useSelector(getCustomComponents)
  const selectedComponents = isCustomComponentChild
    ? customComponents
    : components
  const [{ isOver }, drop] = useDrop({
    accept,
    hover: (item: ComponentItemProps, monitor: DropTargetMonitor) => {
      if (item.isMoved && boundingPosition) {
        if (componentId === item.id) return
        if (selectedComponents[item.id] === undefined) return

        const selectedComponent = selectedComponents[item.id]
        const { top, bottom } = boundingPosition
        const hoverMiddleY = (bottom - top) / 2
        const clientOffset = monitor.getClientOffset()
        const fromIndex = selectedComponents[
          selectedComponent.parent
        ].children.indexOf(item.id)
        const toIndex = selectedComponents[
          selectedComponent.parent
        ].children.indexOf(componentId)
        const hoverClientY = clientOffset && clientOffset.y - top

        if (toIndex === -1) return

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
      }
    },
  })

  return { hover: drop, isOver }
}
