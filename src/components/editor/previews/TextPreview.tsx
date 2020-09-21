import React, { FunctionComponent, ComponentClass } from 'react'
import { Box } from '@chakra-ui/core'
import { useInteractive } from '../../../hooks/useInteractive'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'
import { getInputTextFocused } from '../../../core/selectors/app'
import { useSelector } from 'react-redux'
import {
  getCurrentSelectedComponents,
  getSelectedComponentId,
} from '../../../core/selectors/components'
import ComponentPreview from '../ComponentPreview'
import useDispatch from '../../../hooks/useDispatch'
import { getTextValue } from '../../../core/selectors/text'

const TextPreview: React.FC<{
  component: IComponent
  type: string | FunctionComponent<any> | ComponentClass<any, any>
  customProps: IProp[]
  enableVisualHelper?: boolean
  isBoxWrapped?: boolean
}> = ({
  component,
  type,
  customProps,
  enableVisualHelper,
  isBoxWrapped,
  ...forwardedProps
}) => {
  const { props: componentProps, ref, elem } = useInteractive(
    component,
    enableVisualHelper,
  )
  const dispatch = useDispatch()
  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)
  const inputTextFocused = useSelector(getInputTextFocused)
  const selectedComponents = useSelector(
    getCurrentSelectedComponents(component.id),
  )
  const textValue = useSelector(getTextValue)
  const selectedId = useSelector(getSelectedComponentId)

  const componentChildren =
    propsKeyValue.children && Array.isArray(propsKeyValue.children)
      ? propsKeyValue.children
      : [propsKeyValue.children]

  const blurHandler = (event: React.SyntheticEvent<any>) => {
    event.preventDefault()
    event.stopPropagation()
    dispatch.text.setSelectionDetails()

    const element = event.currentTarget
    if (element) {
      if (element.childNodes.length === 0)
        dispatch.components.updateTextChildrenProp({
          id: component.id,
          value: '',
        })
      else {
        const childrenDetails: Array<{
          type: string
          value: string
          componentId?: string
        }> = []

        let spanChildrenIndex = 0
        element.childNodes.forEach((child: Node) => {
          let value: any = child.nodeValue
          if (child.nodeName === 'SPAN') {
            value = child.firstChild?.nodeValue
            childrenDetails.push({
              type: child.nodeName,
              value: value || '',
              componentId: element.children[spanChildrenIndex].id,
            })
            spanChildrenIndex = spanChildrenIndex + 1
          } else
            childrenDetails.push({
              type: child.nodeName,
              value: value || '',
            })
        })
        dispatch.components.updateTextChildrenProp({
          id: component.id,
          value: childrenDetails,
        })
      }
    }
    dispatch.app.toggleInputText(false)
  }

  const doubleClickHandler = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    dispatch.text.setTextValue(elem?.innerHTML || textValue)
    dispatch.app.toggleInputText(true)
  }

  const pasteHandler = (e: any) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }
  const mouseUpHandler = () => dispatch.text.setSelectionDetails()

  const keyDownHandler = (e: any) => {
    if ((e.which === 37 && e.shiftKey) || (e.which === 39 && e.shiftKey))
      dispatch.text.setSelectionDetails()

    //Enter key not allowed(paragraph breaks)
    if (e.which === 13) e.preventDefault()
  }

  propsKeyValue['onDoubleClick'] = doubleClickHandler

  const Element = React.createElement(
    type,
    {
      ...propsKeyValue,
      ...forwardedProps,
      ref,
    },
    componentChildren.map((key: string) => {
      if (selectedComponents[key])
        return (
          <ComponentPreview
            key={key}
            componentName={key}
            disableSelection={inputTextFocused ? true : false}
          />
        )
      else return key
    }),
  )

  const contentEditableElement = React.createElement(
    type,
    {
      ...propsKeyValue,
      ...forwardedProps,
    },
    <Box
      contentEditable={true}
      suppressContentEditableWarning={true}
      onBlur={blurHandler}
      onPaste={pasteHandler}
      onMouseUp={mouseUpHandler}
      onKeyDown={keyDownHandler}
      dangerouslySetInnerHTML={{ __html: textValue }}
    />,
  )

  return inputTextFocused && component.id === selectedId
    ? contentEditableElement
    : Element
}

export default TextPreview