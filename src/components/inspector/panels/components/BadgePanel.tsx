import React, { memo } from 'react'

import ColorsControl from '../../controls/ColorsControl'
import ChildrenControl from '../../controls/ChildrenControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import VariantsControl from '../../controls/VariantsControl'

const BadgePanel = () => {
  const variant = usePropsSelector('variant')

  return (
    <>
      <ChildrenControl />

      <VariantsControl
        options={['solid', 'outline', 'subtle']}
        value={variant || 'subtle'}
      />

      <ColorsControl label="Color Scheme" name="colorScheme" />
    </>
  )
}

export default memo(BadgePanel)
