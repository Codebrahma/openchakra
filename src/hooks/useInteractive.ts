import { useRef, MouseEvent } from 'react'
import { useSelector } from 'react-redux'
import useDispatch from './useDispatch'
import { useDrag } from 'react-dnd'
import {
  getIsSelectedComponent,
  getIsHovered,
  getShowCustomComponentPage,
  isChildrenOfCustomComponent,
  getPropsBy,
} from '../core/selectors/components'
import { getShowLayout, getFocusedComponent } from '../core/selectors/app'
import { generateId } from '../utils/generateId'

export const useInteractive = (
  component: IComponent,
  enableVisualHelper: boolean = false,
  isCustomComponent?: boolean,
  onlyVisualHelper?: boolean,
) => {
  const dispatch = useDispatch()
  const showLayout = useSelector(getShowLayout)
  const isComponentSelected = useSelector(getIsSelectedComponent(component.id))
  const isHovered = useSelector(getIsHovered(component.id))
  const focusInput = useSelector(getFocusedComponent(component.id))
  const isCustomComponentPage = useSelector(getShowCustomComponentPage)
  const isCustomComponentChild = useSelector(
    isChildrenOfCustomComponent(component.id),
  )
  const fetchedProps = useSelector(getPropsBy(component.id))
  const enableInteractive = isCustomComponentPage || !isCustomComponentChild
  const componentProps = onlyVisualHelper ? [] : [...fetchedProps]

  //every custom component type is changed to custom type because only that type will be accepted in the drop.
  const [, drag] = useDrag({
    item: {
      id: component.id,
      type: isCustomComponent ? 'Custom' : component.type,
      isMoved: true,
    },
  })

  const ref = useRef<HTMLDivElement>(null)
  let props = enableInteractive
    ? [
        ...componentProps,
        {
          id: generateId(),
          name: 'onMouseOver',
          value: (event: MouseEvent) => {
            event.stopPropagation()
            dispatch.components.hover(component.id)
          },
          componentId: component.id,
          derivedFromComponentType: null,
          derivedFromPropName: null,
        },
        {
          id: generateId(),
          name: 'onMouseOut',
          value: () => {
            dispatch.components.unhover()
          },
          componentId: component.id,
          derivedFromComponentType: null,
          derivedFromPropName: null,
        },
        {
          id: generateId(),
          name: 'onClick',
          value: (event: MouseEvent) => {
            event.preventDefault()
            event.stopPropagation()
            dispatch.components.select(component.id)
          },
          componentId: component.id,
          derivedFromComponentType: null,
          derivedFromPropName: null,
        },
        {
          id: generateId(),
          name: 'onDoubleClick',
          value: (event: MouseEvent) => {
            event.preventDefault()
            event.stopPropagation()
            if (focusInput === false) {
              dispatch.app.toggleInputText()
            }
          },
          componentId: component.id,
          derivedFromComponentType: null,
          derivedFromPropName: null,
        },
      ]
    : [...componentProps]

  if (showLayout && enableVisualHelper) {
    props = [
      {
        id: generateId(),
        name: 'border',
        value: `1px dashed #718096`,
        componentId: component.id,
        derivedFromComponentType: null,
        derivedFromPropName: null,
      },
      {
        id: generateId(),
        name: 'padding',
        value: 4,
        componentId: component.id,
        derivedFromComponentType: null,
        derivedFromPropName: null,
      },
      ...props,
    ]
  }

  if (isHovered || isComponentSelected) {
    props = [
      ...props,
      {
        id: generateId(),
        name: 'boxShadow',
        value: `${focusInput ? '#ffc4c7' : '#4FD1C5'} 0px 0px 0px 2px inset`,
        componentId: component.id,
        derivedFromComponentType: null,
        derivedFromPropName: null,
      },
    ]
  }
  return { props, ref: enableInteractive ? drag(ref) : ref, drag }
}
