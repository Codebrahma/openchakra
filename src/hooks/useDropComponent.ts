import { useDrop, DropTargetMonitor } from 'react-dnd'
import { useSelector } from 'react-redux'

import { rootComponents } from '../utils/editor'
import useDispatch from './useDispatch'
import {
  getComponents,
  isChildrenOfCustomComponent,
  getCustomComponents,
  getCustomComponentsProps,
} from '../core/selectors/components'
import { getCode, getAllComponentsCode } from '../core/selectors/code'
import babelQueries from '../babel-queries/queries'
import { searchRootCustomComponent } from '../utils/recursive'
import { generateComponentId } from '../utils/generateId'
import useMoveComponent from './useMoveComponent'
import checkIsComponentId from '../utils/checkIsComponentId'
import checkIsContainerComponent from '../utils/checkIsContainerComponent'
import { checkIsCustomPage, getSelectedPage } from '../core/selectors/page'
import { useQueue } from './useQueue'
import componentsStructure from '../utils/componentsStructure/componentsStructure'

// Get the props of the given custom component
export const getPropsOfCustomComponent = (
  componentId: string,
  customComponentsProps: IProps,
): IProp[] => {
  const propIds = customComponentsProps.byComponentId[componentId]

  if (propIds && propIds.length > 0) {
    return customComponentsProps.byComponentId[componentId].map(propId => {
      const prop = customComponentsProps.byId[propId]

      // If the prop-value is a component-id, generate a new componentId. this includes the exposed children of Box or Flex
      // New-id is generated for the box component in the exposed children prop.
      if (checkIsComponentId(prop.value)) {
        const newComponentId = generateComponentId()
        prop.value = newComponentId
        return prop
      } else {
        return prop
      }
    })
  } else return []
}

export const useDropComponent = (
  targetComponentId: string,
  accept: ComponentType[] = [...rootComponents],
  canDrop: boolean = true,
  boundingPosition?: {
    top: number
    bottom: number
  },
) => {
  const dispatch = useDispatch()
  const queue = useQueue()

  const isCustomPage = useSelector(checkIsCustomPage)
  const components = useSelector(getComponents(targetComponentId))
  const isCustomComponentChild = useSelector(
    isChildrenOfCustomComponent(targetComponentId),
  )
  const code = useSelector(getCode)
  const selectedPage = useSelector(getSelectedPage)
  const customComponents = useSelector(getCustomComponents)
  const customComponentsProps = useSelector(getCustomComponentsProps)
  const componentsCode = useSelector(getAllComponentsCode)
  let rootParentOfParentElement: string = ``
  const onComponentMoved = useMoveComponent(targetComponentId)

  if (isCustomComponentChild) {
    rootParentOfParentElement = searchRootCustomComponent(
      customComponents[targetComponentId],
      customComponents,
    )
  }

  const updateCode = (code: string) => {
    if (code.length > 0) {
      // update the code
      isCustomComponentChild
        ? dispatch.code.setComponentsCode(code, rootParentOfParentElement)
        : dispatch.code.setPageCode(code, selectedPage)
    }
  }

  const [{ isOver }, drop] = useDrop({
    accept: accept,
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }) && monitor.canDrop(),
    }),
    hover: (item: ComponentItemProps, monitor: DropTargetMonitor) => {
      if (item.isMoved && boundingPosition) {
        if (targetComponentId === item.id) return
        if (components[item.id] === undefined) return

        const selectedComponent = components[item.id]
        const targetComponentParent = components[targetComponentId].parent

        // Only reorder if the selected component and the targeted component are in the same parent.
        if (targetComponentParent !== selectedComponent.parent) return

        if (selectedComponent.parent === 'Prop') return

        const { top, bottom } = boundingPosition
        const hoverMiddleY = (bottom - top) / 2
        const clientOffset = monitor.getClientOffset()
        const fromIndex = components[selectedComponent.parent].children.indexOf(
          item.id,
        )
        const toIndex = components[selectedComponent.parent].children.indexOf(
          targetComponentId,
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

        queue.enqueue(async () => {
          const updatedCode = babelQueries.reorderComponentChildren(
            isCustomComponentUpdate
              ? componentsCode[rootParentOfParentElement]
              : code,
            {
              componentId: selectedComponent.parent,
              fromIndex,
              toIndex,
            },
          )
          updateCode(updatedCode)
          return
        })
      }
    },
    canDrop: () => canDrop,
    drop: (item: ComponentItemProps, monitor: DropTargetMonitor) => {
      if (!monitor.isOver()) {
        return
      }
      if (isCustomComponentChild && !isCustomPage) return

      if (item.isMoved) {
        onComponentMoved(item.id)
      } else {
        let updatedCode: string = ``
        const newComponentId = generateComponentId()

        // TODO : Yet to be refactored. Everything should go into a private function
        if (item.custom) {
          // Get the default props for the required custom component type.
          const defaultProps = getPropsOfCustomComponent(
            item.id,
            customComponentsProps,
          )

          dispatch.components.addCustomComponent({
            componentId: newComponentId,
            parentId: targetComponentId,
            type: item.id,
            defaultProps,
          })

          queue.enqueue(async () => {
            const isContainerComponent = checkIsContainerComponent(
              item.id,
              customComponentsProps,
            )
            updatedCode = babelQueries.addCustomComponent(
              isCustomComponentChild
                ? componentsCode[rootParentOfParentElement]
                : code,
              {
                componentId: newComponentId,
                parentId: targetComponentId,
                type: item.id,
                defaultProps,
                isContainerComponent,
              },
            )
            updateCode(updatedCode)
          })
        } else {
          const componentCode = componentsStructure[item.type]
          const componentWithCompId = babelQueries.setComponentIdToAllComponents(
            componentCode,
          )

          // The state includes components, props & root-component-id
          const state = babelQueries.getComponentsAndProps(
            componentWithCompId,
            { parentId: targetComponentId },
          )

          // An avatar can only have one avatar badge.
          if (
            item.type === 'AvatarBadge' &&
            components[targetComponentId].children.length > 0
          )
            return

          dispatch.components.addComponent({
            ...state,
            parentId: targetComponentId,
          })

          queue.enqueue(async () => {
            updatedCode = babelQueries.addComponent(
              isCustomComponentChild
                ? componentsCode[rootParentOfParentElement]
                : code,
              {
                componentCode: componentWithCompId,
                parentId: targetComponentId,
              },
            )
            updateCode(updatedCode)
          })
        }
      }
    },
  })

  return { drop, isOver }
}
