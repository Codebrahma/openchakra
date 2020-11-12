import React, { memo } from 'react'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import { Input } from '@chakra-ui/core'
import { useForm } from '../../../../hooks/useForm'
import FormControl from '../../controls/FormControl'

const RadioGroupPanel = () => {
  const { setValue } = useForm()
  const { propId: spacingId, propValue: spacingValue } = usePropsSelector(
    'spacing',
  )

  return (
    <>
      <FormControl label="Spacing">
        <Input
          value={spacingValue || ''}
          name="spacing"
          onChange={e => setValue(spacingId, 'spacing', e.target.value)}
        />
      </FormControl>
      <SwitchControl label="Inline" name="isInline" />
    </>
  )
}

export default memo(RadioGroupPanel)
