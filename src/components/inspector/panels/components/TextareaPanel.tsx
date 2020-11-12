import React, { memo } from 'react'
import { Input, Select } from '@chakra-ui/core'
import FormControl from '../../controls/FormControl'
import { useForm } from '../../../../hooks/useForm'
import SizeControl from '../../controls/SizeControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'

const TextareaPanel = () => {
  const { setValue } = useForm()

  const {
    propId: placeholderId,
    propValue: placeholderValue,
  } = usePropsSelector('placeholder')
  const { propId: sizeId, propValue: sizeValue } = usePropsSelector('size')
  const { propId: reSizeId, propValue: reSizeValue } = usePropsSelector(
    'resize',
  )

  return (
    <>
      <FormControl label="Placeholder">
        <Input
          id={placeholderId}
          size="sm"
          value={placeholderValue || ''}
          type="text"
          name="placeholder"
          onChange={e => setValue(placeholderId, 'placeholder', e.target.value)}
        />
      </FormControl>
      <SizeControl id={sizeId} options={['sm', 'md', 'lg']} value={sizeValue} />
      <FormControl label="Resize" htmlFor="resize">
        <Select
          name="resize"
          id={reSizeId}
          size="sm"
          value={reSizeValue || ''}
          onChange={e => setValue(reSizeId, 'resize', e.target.value)}
        >
          <option>horizontal</option>
          <option>vertical</option>
          <option>none</option>
        </Select>
      </FormControl>
    </>
  )
}

export default memo(TextareaPanel)
