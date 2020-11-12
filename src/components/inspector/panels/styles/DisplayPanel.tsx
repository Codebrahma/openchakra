import React, { memo } from 'react'
import { Select } from '@chakra-ui/core'
import FormControl from '../../controls/FormControl'
import { useForm } from '../../../../hooks/useForm'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import DisplayFlexPanel from './DisplayFlexPanel'

const DisplayPanel = () => {
  const { setValue } = useForm()
  const { propId: displayId, propValue: displayValue } = usePropsSelector(
    'display',
  )

  return (
    <>
      <FormControl label="Display">
        <Select
          id={displayId}
          size="sm"
          value={displayValue || ''}
          onChange={e => setValue(displayId, 'display', e.target.value)}
          name="display"
        >
          <option>block</option>
          <option>flex</option>
          <option>inline</option>
          <option>grid</option>
          <option>inline-block</option>
        </Select>
      </FormControl>

      {displayValue === 'flex' && <DisplayFlexPanel />}
    </>
  )
}

export default memo(DisplayPanel)
