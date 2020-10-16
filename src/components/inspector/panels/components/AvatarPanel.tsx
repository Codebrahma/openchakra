import React, { memo } from 'react'
import FormControl from '../../controls/FormControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import TextControl from '../../controls/TextControl'
import ComboBox from '../../inputs/ComboBox'

const AvatarPanel = () => {
  const size = usePropsSelector('size')

  const sizesArray = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']

  return (
    <>
      <FormControl label="Size" htmlFor="size">
        <ComboBox
          options={sizesArray}
          value={size || ''}
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
