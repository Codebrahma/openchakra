import React, { memo } from 'react'
import ChildrenControl from '../../controls/ChildrenControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import ComboBox from '../../inputs/ComboBox'
import FormControl from '../../controls/FormControl'

const AlertTitlePanel = () => {
  const fontSize = usePropsSelector('fontSize')

  return (
    <>
      <ChildrenControl />
      <FormControl label="Size" htmlFor="size">
        <ComboBox
          name="fontSize"
          value={fontSize}
          options={['xs', 'sm', 'md', 'lg']}
        />
      </FormControl>
    </>
  )
}

export default memo(AlertTitlePanel)
