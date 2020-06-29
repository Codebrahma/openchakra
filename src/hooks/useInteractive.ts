import { useRef, MouseEvent } from 'react'
import { useSelector } from 'react-redux'
import useDispatch from './useDispatch'
import { useDrag } from 'react-dnd'
import {
  getIsSelectedComponent,
  getIsHovered,
  getShowCustomComponentPage,
  isChildrenOfCustomComponent,
} from '../core/selectors/components'
import { getShowLayout, getFocusedComponent } from '../core/selectors/app'

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
  const enableInteractive = isCustomComponentPage || !isCustomComponentChild
  const componentProps = onlyVisualHelper ? {} : { ...component.props }

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
    ? {
        ...componentProps,
        onMouseOver: (event: MouseEvent) => {
          event.stopPropagation()
          dispatch.components.hover(component.id)
        },
        onMouseOut: () => {
          dispatch.components.unhover()
        },
        onClick: (event: MouseEvent) => {
          event.preventDefault()
          event.stopPropagation()
          dispatch.components.select(component.id)
        },
        onDoubleClick: (event: MouseEvent) => {
          event.preventDefault()
          event.stopPropagation()
          if (focusInput === false) {
            dispatch.app.toggleInputText()
          }
        },
      }
    : { ...componentProps }

  if (showLayout && enableVisualHelper) {
    props = {
      ...props,
      border: `1px dashed #718096`,
      padding: props.p || props.padding ? props.p || props.padding : 4,
    }
  }

  if (isHovered || isComponentSelected) {
    props = {
      ...props,
      boxShadow: `${focusInput ? '#ffc4c7' : '#4FD1C5'} 0px 0px 0px 2px inset`,
    }
  }

  return { props, ref: enableInteractive ? drag(ref) : ref, drag }
}
