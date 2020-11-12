import React, { memo } from 'react'
import FormControl from '../../controls/FormControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import ComboBox from '../../inputs/ComboBox'
import VariantsControl from '../../controls/VariantsControl'

const AlertPanel = () => {
  const { propId: variantId, propValue: variantValue } = usePropsSelector(
    'variant',
  )
  const { propId: statusId, propValue: statusValue } = usePropsSelector(
    'status',
  )

  const statusProps = ['error', 'success', 'warning', 'info']
  const variantProps = ['subtle', 'solid', 'left-accent', 'top-accent']

  return (
    <>
      <FormControl label="Status" htmlFor="status">
        <ComboBox
          id={statusId}
          options={statusProps}
          value={statusValue || 'info'}
          name="status"
          editable={false}
        />
      </FormControl>

      <VariantsControl
        id={variantId}
        options={variantProps}
        value={variantValue || 'subtle'}
      />
    </>
  )
}

export default memo(AlertPanel)
