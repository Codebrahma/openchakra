import React, { ReactNode } from 'react'

import { useForm } from '../../../hooks/useForm'
import ComboBox from 'react-responsive-combo-box'
import 'react-responsive-combo-box/dist/index.css'

type FormControlPropType = {
  options: string[]
  value: any
  id: string
  name: string
  placeholder?: string
  renderOptions?: (options: string) => ReactNode
  enableAutoComplete?: boolean
  editable?: boolean
}

const ComboBoxComponent: React.FC<FormControlPropType> = ({
  options,
  value,
  id,
  name,
  placeholder,
  enableAutoComplete,
  renderOptions,
  editable = true,
}) => {
  const { setValue } = useForm()

  return (
    <ComboBox
      options={options}
      defaultValue={value}
      onChange={e => setValue(id, name, e.target.value)}
      renderOptions={renderOptions}
      placeholder={placeholder}
      onSelect={option => setValue(id, name, option)}
      onOptionsChange={option => setValue(id, name, option, false)}
      style={{ height: '2rem', width: '100%', fontSize: '14px' }}
      onBlur={e => setValue(id, name, e?.target.value)}
      enableAutocomplete={enableAutoComplete}
      inputStyles={{ border: '1px solid #E2E8F0' }}
      editable={editable}
    />
  )
}

export default ComboBoxComponent
