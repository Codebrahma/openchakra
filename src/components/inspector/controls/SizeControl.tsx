import React from 'react'
import FormControl from './FormControl'
import ComboBox from '../inputs/ComboBox'

type SizeControlPropsType = {
  value: string
  options: string[]
}

const SizeControl = (props: SizeControlPropsType) => {
  return (
    <FormControl label="Size" htmlFor="size">
      <ComboBox
        options={props.options}
        name={'size'}
        value={props.value || ''}
      />
    </FormControl>
  )
}

export default SizeControl
