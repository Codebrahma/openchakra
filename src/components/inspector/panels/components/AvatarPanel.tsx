import React, { memo } from 'react'
import FormControl from '../../controls/FormControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import TextControl from '../../controls/TextControl'
import ComboBox from '../../inputs/ComboBox'

const AvatarPanel = () => {
  const { propValue: sizeValue, propId: sizeId } = usePropsSelector('size')

  const sizesArray = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']

  return (
    <>
      <FormControl label="Size" htmlFor="size">
        <ComboBox
          id={sizeId}
          options={sizesArray}
          value={sizeValue || ''}
          name="size"
          editable={false}
        />
      </FormControl>

      <SwitchControl label="Show border" name="showBorder" />
      <TextControl name="name" label="Name" />
      <TextControl name="src" label="Source" />
    </>
  )
}

export default memo(AvatarPanel)
