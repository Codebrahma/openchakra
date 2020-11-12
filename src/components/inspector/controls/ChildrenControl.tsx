import React, { useRef, KeyboardEvent } from 'react'
import { Input } from '@chakra-ui/core'
import FormControl from './FormControl'
import { useForm } from '../../../hooks/useForm'
import usePropsSelector from '../../../hooks/usePropsSelector'

const ChildrenControl: React.FC = () => {
  const textInput = useRef<HTMLInputElement>(null)
  const { setValue } = useForm()
  const { propId, propValue } = usePropsSelector('children')
  const onKeyUp = (event: KeyboardEvent) => {
    if (event.keyCode === 13 && textInput.current) {
      textInput.current.blur()
    }
  }

  return (
    <FormControl htmlFor="children" label="Text">
      <Input
        id={propId}
        name="children"
        size="sm"
        value={propValue}
        type="text"
        onChange={e => setValue(propId, 'children', e.target.value)}
        ref={textInput}
        onKeyUp={onKeyUp}
      />
    </FormControl>
  )
}

export default ChildrenControl
