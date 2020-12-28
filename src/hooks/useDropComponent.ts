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
import builder from '../core/models/composer/builder'

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

        dispatch.components.moveSelectedComponentChildren({
          componentId: selectedComponent.parent,
          fromIndex,
          toIndex,
        })
        const updatedCode = babelQueries.reorderComponentChildren(
          isCustomComponentUpdate ? componentsCode[rootCustomParent] : code,
          {
            componentId: selectedComponent.parent,
            fromIndex,
            toIndex,
          },
        )
        dispatch.code.setPageCode(
          updatedCode,
          isCustomComponentUpdate ? rootCustomParent : selectedPage,
        )
      }
    },
    canDrop: () => canDrop,
    drop: (item: ComponentItemProps, monitor: DropTargetMonitor) => {
      if (!monitor.isOver()) {
        return
      }
      if (isCustomComponentChild && !isCustomPage) return

      if (item.isMoved) {
        dispatch.components.moveComponent({
          componentId: item.id,
          parentId: componentId,
        })
        const updatedCode = babelQueries.moveComponent(code, {
          componentId: item.id,
          newParentId: componentId,
        })
        dispatch.code.setPageCode(updatedCode, selectedPage)
      } else {
        let updatedCode: string = ``

        if (item.custom) {
          dispatch.components.addCustomComponent({
            parentId: componentId,
            type: item.id,
          })
          updatedCode = babelQueries.addCustomComponent(
            isCustomComponentChild ? componentsCode[rootCustomParent] : code,
            {
              parentId: componentId,
              type: item.id,
            },
          )
        } else {
          if (item.isMeta) {
            dispatch.components.addMetaComponent(
              builder[item.type](componentId),
            )
          } else {
            dispatch.components.addComponent({
              parentName: componentId,
              type: item.type,
            })
          }
          updatedCode = updatedCode = babelQueries.addComponent(
            isCustomComponentChild ? componentsCode[rootCustomParent] : code,
            {
              parentId: componentId,
              type: item.type,
            },
          )
        }
        dispatch.code.setPageCode(
          updatedCode,
          isCustomComponentChild ? rootCustomParent : selectedPage,
        )
      }
    },
  })

  return { drop, isOver }
}
