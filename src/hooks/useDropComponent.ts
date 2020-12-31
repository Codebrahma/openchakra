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
import { generateComponentId } from '../utils/generateId'

import builder from '../core/models/composer/builder'

export const useDropComponent = (
  parentId: string,
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
    isChildrenOfCustomComponent(parentId),
  )
  const code = useSelector(getCode)
  const selectedPage = useSelector(getSelectedPage)
  const customComponents = useSelector(getCustomComponents)
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
        dispatch.code.setPageCode(
          updatedCode,
          isCustomComponentUpdate ? rootParentOfParentElement : selectedPage,
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
          parentId,
        })
        setTimeout(() => {
          moveComponentBabelQueryHandler(item.id)
        }, 200)
      } else {
        let updatedCode: string = ``
        const newComponentId = generateComponentId()

        // TODO : Yet to be refactored. Everything should go into a private function
        if (item.custom) {
          dispatch.components.addCustomComponent({
            componentId: newComponentId,
            parentId,
            type: item.id,
          })
          updatedCode = babelQueries.addCustomComponent(
            isCustomComponentChild
              ? componentsCode[rootParentOfParentElement]
              : code,
            {
              componentId: newComponentId,
              parentId,
              type: item.id,
            },
          )
        } else if (item.isMeta) {
          const metaBuilderObject = builder[item.type](parentId)

          dispatch.components.addMetaComponent(metaBuilderObject)

          updatedCode = babelQueries.addMetaComponent(code, {
            componentIds: metaBuilderObject.componentIds,
            parentId,
            type: item.type,
          })
        } else {
          dispatch.components.addComponent({
            componentId: newComponentId,
            parentId,
            type: item.type,
          })
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
        }

        if (updatedCode.length > 0) {
          if (isCustomComponentChild) {
            dispatch.code.setComponentsCode(
              updatedCode,
              rootParentOfParentElement,
            )
          } else {
            dispatch.code.setPageCode(updatedCode, selectedPage)
          }
        }
      }
    },
  })

  return { drop, isOver }
}
