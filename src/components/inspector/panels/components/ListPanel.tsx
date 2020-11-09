import React, { memo } from 'react'
import FormControl from '../../controls/FormControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import ComboBox from '../../inputs/ComboBox'

const ListPanel = () => {
  const { propId: styleTypeId, propValue: styleTypeValue } = usePropsSelector(
    'styleType',
  )

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
          id={styleTypeId}
          value={styleTypeValue || 'md'}
          name="styleType"
          options={styleTypePropValues}
        />
      </FormControl>
    </>
  )
}

export default memo(ListPanel)
