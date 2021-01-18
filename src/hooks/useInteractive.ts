import { useRef, MouseEvent, useState } from 'react'
import { useSelector } from 'react-redux'
import useDispatch from './useDispatch'
import { useDrag } from 'react-dnd'
import {
  checkIsComponentSelected,
  isChildrenOfCustomComponent,
  getPropsBy,
  isImmediateChildOfCustomComponent,
  getIsHovered,
  getSelectedComponentId,
} from '../core/selectors/components'
import { getShowLayout } from '../core/selectors/app'
import { generatePropId } from '../utils/generateId'
import useCustomTheme from './useCustomTheme'
import { checkIsCustomPage } from '../core/selectors/page'

export const useInteractive = (
  component: IComponent,
  enableVisualHelper: boolean = false,
  disableInteraction: boolean = false,
  isInstanceOfCustomComponent?: boolean,
) => {
  const dispatch = useDispatch()
  const showLayout = useSelector(getShowLayout)
  const isComponentSelected = useSelector(
    checkIsComponentSelected(component.id),
  )
  const isElementOnInspectorHovered = useSelector(getIsHovered(component.id))
  const isCustomPage = useSelector(checkIsCustomPage)
  const isCustomComponentChild = useSelector(
    isChildrenOfCustomComponent(component.id),
  )
  const isImmediateChild = useSelector(
    isImmediateChildOfCustomComponent(component),
  )
  const currentSelectedId = useSelector(getSelectedComponentId)

  const fetchedProps = useSelector(getPropsBy(component.id))
  const enableInteractive =
    (isCustomPage || !isCustomComponentChild) && !disableInteraction

  const componentProps = isInstanceOfCustomComponent ? [] : [...fetchedProps]
  const theme = useCustomTheme()
  const [isHovered, setIsHovered] = useState(false)

  //Finds whether the component is span or not.
  const isSpanElement =
    component.type === 'Box' &&
    fetchedProps.findIndex(
      prop => prop.name === 'as' && prop.value === 'span',
    ) !== -1

  //every custom component type is changed to custom type because only that type will be accepted in the drop.
  const [, drag] = useDrag({
    item: {
      id: component.id,
      type: isInstanceOfCustomComponent ? 'Custom' : component.type,
      isMoved: true,
    },
  })

  const ref = useRef<HTMLDivElement>(null)

  //In order to find the styles for the span we are storing the id.
  if (ref.current) ref.current.id = component.id

  const boundingPosition =
    ref.current !== null ? ref.current.getBoundingClientRect() : undefined

  let props = enableInteractive
    ? [
        {
          id: generatePropId(),
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
          id: generatePropId(),
          name: 'onMouseOut',
          value: () => {
            setIsHovered(false)
          },
          componentId: component.id,
          derivedFromComponentType: null,
          derivedFromPropName: null,
        },
        {
          id: generatePropId(),
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
        id: generatePropId(),
        name: 'border',
        value: `1px dashed #718096`,
        componentId: component.id,
        derivedFromComponentType: null,
        derivedFromPropName: null,
      },
      {
        id: generatePropId(),
        name: 'padding',
        value: isSpanElement ? '0.3rem' : '1rem', //1rem padding will be very big for the span. So for span elements, the padding is reduced to 0.3rem
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
        id: generatePropId(),
        name: 'width',
        value: '100%',
        componentId: component.id,
        derivedFromComponentType: null,
        derivedFromPropName: null,
      },
    ]
  }

  if (enableInteractive) {
    props.push({
      id: generatePropId(),
      name: 'onClick',
      value: (event: MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        if (currentSelectedId !== component.id) {
          dispatch.components.select(component.id)
          dispatch.text.reset()
        }
      },
      componentId: component.id,
      derivedFromComponentType: null,
      derivedFromPropName: null,
    })

    if (isHovered || isComponentSelected || isElementOnInspectorHovered) {
      props.push({
        id: generatePropId(),
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
    ref: enableInteractive ? drag(ref) : ref,
    elem: ref.current,
    drag,
    boundingPosition,
  }
}
