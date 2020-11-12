import React, { memo } from 'react'

import ColorsControl from '../../controls/ColorsControl'
import ChildrenControl from '../../controls/ChildrenControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import VariantsControl from '../../controls/VariantsControl'

const BadgePanel = () => {
  const { propId: variantId, propValue: variantValue } = usePropsSelector(
    'variant',
  )

  return (
    <>
      <ChildrenControl />

      <VariantsControl
        id={variantId}
        options={['solid', 'outline', 'subtle']}
        value={variantValue || 'subtle'}
      />

      <ColorsControl label="Color Scheme" name="colorScheme" />
    </>
  )
}

export default memo(BadgePanel)
