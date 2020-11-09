import React from 'react'
import FormControl from '../../controls/FormControl'
import { Input, Select } from '@chakra-ui/core'
import { useForm } from '../../../../hooks/useForm'
import usePropsSelector from '../../../../hooks/usePropsSelector'

const MenuOptionGroupPanel = () => {
  const { setValue } = useForm()
  const { propId: titleId, propValue: titleValue } = usePropsSelector('title')
  const { propId: typeId, propValue: typeValue } = usePropsSelector('type')

  return (
    <>
      <FormControl label="Title">
        <Input
          size="sm"
          value={titleValue || 'Title'}
          type="text"
          onChange={e => setValue(titleId, 'title', e.target.value)}
        />
      </FormControl>
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

export default MenuOptionGroupPanel
