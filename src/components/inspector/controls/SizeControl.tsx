import React from 'react'
import FormControl from './FormControl'
import ComboBox from '../inputs/ComboBox'

export type Size = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

type SizeControlPropsType = {
  id: string
  value: string
  options: Size[]
}

const SizeControl = (props: SizeControlPropsType) => {
  return (
    <FormControl label="Size" htmlFor="size">
      <ComboBox
        id={props.id}
        options={props.options}
        name={'size'}
        value={props.value || ''}
      />
    </FormControl>
  )
}

export default SizeControl
