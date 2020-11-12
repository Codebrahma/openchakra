import React, { memo } from 'react'
import { Select } from '@chakra-ui/core'
import FormControl from '../../controls/FormControl'
import { useForm } from '../../../../hooks/useForm'
import ColorsControl from '../../controls/ColorsControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'

const DividerPanel = () => {
  const { setValue } = useForm()
  const {
    propId: orientationId,
    propValue: orientationValue,
  } = usePropsSelector('orientation')

  return (
    <>
      <FormControl label="Orientation" htmlFor="orientation">
        <Select
          name="orientation"
          id={orientationId}
          size="sm"
          value={orientationValue || 'horizontal'}
          onChange={e => setValue(orientationId, 'orientation', e.target.value)}
        >
          <option>horizontal</option>
          <option>vertical</option>
        </Select>
      </FormControl>
      <ColorsControl
        withFullColor
        label="Border color"
        name="borderColor"
        enableHues
      />
    </>
  )
}

export default memo(DividerPanel)
