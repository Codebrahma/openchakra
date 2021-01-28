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
}

export const useDropComponent = (
  parentId: string,
  accept: ComponentType[] = [...rootComponents],
  canDrop: boolean = true,
  boundingPosition?: {
    top: number
    bottom: number
  },
) => {
  const dispatch = useDispatch()
  const isCustomPage = useSelector(checkIsCustomPage)

  const components = useSelector(getComponents())
  const isCustomComponentChild = useSelector(
    isChildrenOfCustomComponent(parentId),
  )
  const code = useSelector(getCode)
  const selectedPage = useSelector(getSelectedPage)
  const customComponents = useSelector(getCustomComponents)
  const customComponentsProps = useSelector(getCustomComponentsProps)
  const componentsCode = useSelector(getAllComponentsCode)
  let rootParentOfParentElement: string = ``
  const onComponentMoved = useMoveComponent(parentId)
  const queue = useQueue()

  if (isCustomComponentChild) {
    rootParentOfParentElement = searchRootCustomComponent(
      customComponents[parentId],
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
        if (parentId === item.id) return
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
          parentId,
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
            parentId,
            type: item.id,
            defaultProps,
          })
          setTimeout(() => {
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
                parentId,
                type: item.id,
                defaultProps,
                isContainerComponent,
              },
            )
            updateCode(updatedCode)
          }, 200)
        } else if (item.isMeta) {
          const componentCode = componentsStructure[item.type]
          const componentWithCompId = babelQueries.setComponentIdToAllComponents(
            componentCode,
          )

          // The state includes components, props & root-component-id
          const state = babelQueries.getComponentsAndProps(
            componentWithCompId,
            { parentId },
          )

          dispatch.components.addMetaComponent({ ...state, parentId })

          setTimeout(() => {
            updatedCode = babelQueries.addMetaComponent(code, {
              metaComponentCode: componentWithCompId,
              parentId,
            })
            updateCode(updatedCode)
          }, 200)
        } else {
          dispatch.components.addComponent({
            componentId: newComponentId,
            parentId,
            type: item.type,
          })
          setTimeout(() => {
            updatedCode = updatedCode = babelQueries.addComponent(
              isCustomComponentChild
                ? componentsCode[rootParentOfParentElement]
                : code,
              {
                componentId: newComponentId,
                parentId,
                type: item.type,
              },
            )
            updateCode(updatedCode)
          }, 200)
        }
      }
    },
  })

  return { drop, isOver }
}
