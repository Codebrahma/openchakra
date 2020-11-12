import React from 'react'
import FormControl from '../../controls/FormControl'
import { Select } from '@chakra-ui/core'
import { useForm } from '../../../../hooks/useForm'
import usePropsSelector from '../../../../hooks/usePropsSelector'

const MenuItemPanel = () => {
  const { setValue } = useForm()
  const { propId: roleId, propValue: roleValue } = usePropsSelector('role')

  return (
    <>
      <FormControl label="Role" htmlFor="role">
        <Select
          size="sm"
          value={roleValue || 'role'}
          onChange={e => setValue(roleId, 'role', e.target.value)}
        >
          <option>menuitem</option>
          <option>menuitemradio</option>
          <option>menuitemcheckbox</option>
        </Select>
      </FormControl>
    </>
  )
}

export default MenuItemPanel
