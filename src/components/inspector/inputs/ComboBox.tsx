import React, { ReactNode } from 'react'

import { useForm } from '../../../hooks/useForm'
import ComboBox from 'react-responsive-combo-box'
import 'react-responsive-combo-box/dist/index.css'

type FormControlPropType = {
  options: string[]
  value: any
  name: string
  placeholder?: string
  renderOptions?: (options: string) => ReactNode
}

const ComboBoxComponent: React.FC<FormControlPropType> = ({
  options,
  value,
  name,
  placeholder,
  renderOptions,
}) => {
  const { setValue } = useForm()

  return (
    <ComboBox
      options={options}
      defaultValue={value}
      onChange={e => setValue(name, e.target.value)}
      renderOptions={renderOptions}
      placeholder={placeholder}
      onSelect={option => setValue(name, option)}
      onOptionsChange={option => setValue(name, option)}
      style={{ height: '2rem', width: '100%', fontSize: '14px' }}
    />
  )
}

export default ComboBoxComponent
