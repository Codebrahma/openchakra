import React from 'react'
import ComboBox from '../inputs/ComboBox'
import FormControl from './FormControl'

type VariantsControlPropsType = {
  id: string
  value: string
  options: string[]
}

const VariantsControl = (props: VariantsControlPropsType) => {
  const { value, options, id } = props

  return (
    <FormControl htmlFor="variant" label="Variant">
      <ComboBox
        id={id}
        options={options}
        value={value || 'subtle'}
        name="variant"
        editable={false}
      />
    </FormControl>
  )
}

export default VariantsControl
