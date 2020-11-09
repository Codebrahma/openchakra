import React from 'react'
import FormControl from '../../controls/FormControl'
import { Select } from '@chakra-ui/core'
import { useForm } from '../../../../hooks/useForm'
import usePropsSelector from '../../../../hooks/usePropsSelector'

const MenuListPanel = () => {
  const { setValue } = useForm()
  const { propId: placementId, propValue: placementValue } = usePropsSelector(
    'placement',
  )

  return (
    <>
      <FormControl label="Placement" htmlFor="placement">
        <Select
          size="sm"
          value={placementValue || 'placement'}
          onChange={e => setValue(placementId, 'placement', e.target.value)}
        >
          <option>auto</option>
          <option>top</option>
          <option>right</option>
          <option>bottom</option>
          <option>left</option>
        </Select>
      </FormControl>
    </>
  )
}

export default MenuListPanel
