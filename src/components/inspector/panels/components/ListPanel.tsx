import React, { memo } from 'react'
import FormControl from '../../controls/FormControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import ComboBox from '../../inputs/ComboBox'

const CodePanel = () => {
  const styleType = usePropsSelector('styleType')

  const styleTypePropValues = [
    'none',
    'disc',
    'circle',
    'square',
    'decimal',
    'georgian',
    'cjk-ideographic',
    'kannada',
  ]

  return (
    <>
      <FormControl label="Style type" htmlFor="styleType">
        <ComboBox
          value={styleType || 'md'}
          name="styleType"
          options={styleTypePropValues}
        />
      </FormControl>
    </>
  )
}

export default memo(CodePanel)
