import React, { useRef, KeyboardEvent } from 'react'
import { Input } from '@chakra-ui/core'
import FormControl from './FormControl'
import useDispatch from '../../../hooks/useDispatch'
import { useForm } from '../../../hooks/useForm'
import usePropsSelector from '../../../hooks/usePropsSelector'

const ChildrenControl: React.FC = () => {
  const dispatch = useDispatch()
  const textInput = useRef<HTMLInputElement>(null)
  const { setValueFromEvent } = useForm()
  const children = usePropsSelector('children')
  const onKeyUp = (event: KeyboardEvent) => {
    if (event.keyCode === 13 && textInput.current) {
      textInput.current.blur()
    }
  }

  return (
    <FormControl htmlFor="children" label="Text">
      <Input
        id="children"
        name="children"
        size="sm"
        value={children}
        type="text"
        onChange={setValueFromEvent}
        ref={textInput}
        onKeyUp={onKeyUp}
        onBlur={() => {
          dispatch.app.toggleInputText(false)
        }}
      />
    </FormControl>
  )
}

export default ChildrenControl
