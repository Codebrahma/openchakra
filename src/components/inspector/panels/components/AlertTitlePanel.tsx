import React, { memo } from 'react'
import ChildrenControl from '../../controls/ChildrenControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import ComboBox from '../../inputs/ComboBox'
import FormControl from '../../controls/FormControl'

const AlertTitlePanel = () => {
  const { propId: fontSizeId, propValue: fontSizeValue } = usePropsSelector(
    'fontSize',
  )

  return (
    <>
      <ChildrenControl />
      <FormControl label="Size" htmlFor="size">
        <ComboBox
          id={fontSizeId}
          name="fontSize"
          value={fontSizeValue}
          options={['xs', 'sm', 'md', 'lg']}
        />
      </FormControl>
    </>
  )
}

export default memo(AlertTitlePanel)
