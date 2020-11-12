import React from 'react'
import FormControl from '../../controls/FormControl'
import { Select } from '@chakra-ui/core'
import { useForm } from '../../../../hooks/useForm'
import usePropsSelector from '../../../../hooks/usePropsSelector'

const MenuItemOptionPanel = () => {
  const { setValue } = useForm()
  const { propValue: typeValue, propId: typeId } = usePropsSelector('type')

  return (
    <>
      <FormControl label="Type" htmlFor="type">
        <Select
          size="sm"
          value={typeValue || 'type'}
          onChange={e => setValue(typeId, 'type', e.target.value)}
        >
          <option>radio</option>
          <option>checkbox</option>
        </Select>
      </FormControl>
    </>
  )
}

export default MenuItemOptionPanel
