import { useRef, MouseEvent, useState } from 'react'
import { useSelector } from 'react-redux'
import useDispatch from './useDispatch'
import { useDrag } from 'react-dnd'
import {
  getIsSelectedComponent,
  getShowCustomComponentPage,
  isChildrenOfCustomComponent,
  getPropsBy,
  isImmediateChildOfCustomComponent,
  getIsHovered,
  getSelectedComponentId,
} from '../core/selectors/components'
import { getShowLayout } from '../core/selectors/app'
import { generateId } from '../utils/generateId'
import { useHoverComponent } from './useHoverComponent'
import useCustomTheme from './useCustomTheme'

export const useInteractive = (
  component: IComponent,
  enableVisualHelper: boolean = false,
  disableSelection: boolean = false,
  isCustomComponent?: boolean,
) => {
  const dispatch = useDispatch()
  const showLayout = useSelector(getShowLayout)
  const isComponentSelected = useSelector(getIsSelectedComponent(component.id))
  const isElementOnInspectorHovered = useSelector(getIsHovered(component.id))
  const [isHovered, setIsHovered] = useState(false)
  // const focusInput = useSelector(getFocusedComponent(component.id))
  const isCustomComponentPage = useSelector(getShowCustomComponentPage)
  const isCustomComponentChild = useSelector(
    isChildrenOfCustomComponent(component.id),
  )
  const isImmediateChild = useSelector(
    isImmediateChildOfCustomComponent(component),
  )
  const currentSelectedId = useSelector(getSelectedComponentId)

  const fetchedProps = useSelector(getPropsBy(component.id))
  const enableInteractive = isCustomComponentPage || !isCustomComponentChild
  const componentProps = isCustomComponent ? [] : [...fetchedProps]
  const theme = useCustomTheme()

  //every custom component type is changed to custom type because only that type will be accepted in the drop.
  const [, drag] = useDrag({
    item: {
      id: component.id,
      type: isCustomComponent ? 'Custom' : component.type,
      isMoved: true,
    },
  })

  const ref = useRef<HTMLDivElement>(null)

  //In order to find the styles for the span we are storing the id.
  if (ref.current) ref.current.id = component.id

  const boundingPosition =
    ref.current !== null ? ref.current.getBoundingClientRect() : undefined
  const { hover } = useHoverComponent(
    component.id,
    boundingPosition && {
      top: boundingPosition.top,
      bottom: boundingPosition.bottom,
    },
  )

  let props = enableInteractive
    ? [
        {
          id: generateId(),
          name: 'onMouseOver',
          value: (event: MouseEvent) => {
            event.stopPropagation()
            setIsHovered(true)
          },
          componentId: component.id,
          derivedFromComponentType: null,
          derivedFromPropName: null,
        },
        {
          id: generateId(),
          name: 'onMouseOut',
          value: () => {
            setIsHovered(false)
          },
          componentId: component.id,
          derivedFromComponentType: null,
          derivedFromPropName: null,
        },
        {
          id: generateId(),
          name: 'fontFamily',
          value:
            component.type === 'Heading'
              ? theme.fonts.heading
              : theme.fonts.body,
          componentId: component.id,
          derivedFromComponentType: null,
          derivedFromPropName: null,
        },
        ...componentProps,
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
        value: '1rem',
        componentId: component.id,
        derivedFromComponentType: null,
        derivedFromPropName: null,
      },
      ...props,
    ]
  }

  //If it is a immediate child of custom component, its width should be 100%.
  if (isImmediateChild) {
    props = [
      ...props,
      {
        id: generateId(),
        name: 'width',
        value: '100%',
        componentId: component.id,
        derivedFromComponentType: null,
        derivedFromPropName: null,
      },
    ]
  }

  if (!disableSelection) {
    props.push({
      id: generateId(),
      name: 'onClick',
      value: (event: MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        if (currentSelectedId !== component.id) {
          dispatch.components.select(component.id)
          dispatch.text.reset()
          dispatch.text.setTextValue(ref.current?.innerHTML || '')
        }
      },
      componentId: component.id,
      derivedFromComponentType: null,
      derivedFromPropName: null,
    })

    if (isHovered || isComponentSelected || isElementOnInspectorHovered) {
      props.push({
        id: generateId(),
        name: 'boxShadow',
        value: `#0C008C 0px 0px 0px 2px inset`,
        componentId: component.id,
        derivedFromComponentType: null,
        derivedFromPropName: null,
      })
    }
  }

  return {
    props,
    ref: enableInteractive ? drag(hover(ref)) : ref,
    elem: ref.current,
    drag,
  }
}
