import { useDrop, DropTargetMonitor } from 'react-dnd'
import { useSelector } from 'react-redux'
import { rootComponents } from '../utils/editor'
import useDispatch from './useDispatch'
import builder from '../core/models/composer/builder'
import {
  getShowCustomComponentPage,
  isChildrenOfCustomComponent,
} from '../core/selectors/components'

export const useDropComponent = (
  componentId: string,
  accept: (ComponentType | MetaComponentType)[] = [...rootComponents],
  canDrop: boolean = true,
) => {
  const dispatch = useDispatch()
  const isCustomPage = useSelector(getShowCustomComponentPage)
  const isCustomComponent = useSelector(
    isChildrenOfCustomComponent(componentId),
  )

  const [{ isOver }, drop] = useDrop({
    accept: [...accept, 'custom'],
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }) && monitor.canDrop(),
    }),
    drop: (item: ComponentItemProps, monitor: DropTargetMonitor) => {
      if (!monitor.isOver()) {
        return
      }
      if (isCustomComponent && !isCustomPage) return

      if (item.isMoved) {
        dispatch.components.moveComponent({
          parentId: componentId,
          componentId: item.id,
        })
      } else if (item.custom) {
        dispatch.components.addCustomComponent({
          parentId: componentId,
          type: item.id,
        })
      } else if (item.isMeta) {
        dispatch.components.addMetaComponent(builder[item.type](componentId))
      } else {
        dispatch.components.addComponent({
          parentName: componentId,
          type: item.type,
          rootParentType: item.rootParentType,
        })
      }
    },
    canDrop: () => canDrop,
  })

  return { drop, isOver }
}
