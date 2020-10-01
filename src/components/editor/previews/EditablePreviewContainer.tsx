import React, { FunctionComponent, ComponentClass } from 'react'
import { Box } from '@chakra-ui/core'
import { useInteractive } from '../../../hooks/useInteractive'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'
import {
  getInputTextFocused,
  getInnerHTMLText,
} from '../../../core/selectors/app'
import { useSelector } from 'react-redux'
import { getSelectedComponentId } from '../../../core/selectors/components'
import useDispatch from '../../../hooks/useDispatch'
import { useDropComponent } from '../../../hooks/useDropComponent'

const EditablePreviewContainer: React.FC<{
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
  const { props: componentProps, ref, elem, boundingPosition } = useInteractive(
    component,
    enableVisualHelper,
  )
  const { drop } = useDropComponent(
    component.id,
    undefined,
    false,
    boundingPosition,
  )
  const dispatch = useDispatch()
  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)
  const inputTextFocused = useSelector(getInputTextFocused)

  const innerHTMLText = useSelector(getInnerHTMLText)
  const selectedId = useSelector(getSelectedComponentId)

  const blurHandler = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    dispatch.text.setSelectionDetails()
    dispatch.app.toggleInputText(false)
    dispatch.components.updateProps({
      id: component.id,
      name: 'children',
      value: event.target.textContent || '',
    })
  }

  const doubleClickHandler = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    dispatch.app.setInnerHTMLText(elem?.innerHTML || innerHTMLText)
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

  const Element = React.createElement(type, {
    ...propsKeyValue,
    ...forwardedProps,
    ref: drop(ref),
  })

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
      dangerouslySetInnerHTML={{ __html: innerHTMLText }}
    />,
  )

  return inputTextFocused && component.id === selectedId
    ? contentEditableElement
    : Element
}

export default EditablePreviewContainer
