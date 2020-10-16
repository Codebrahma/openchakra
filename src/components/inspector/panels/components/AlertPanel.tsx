import React, { memo } from 'react'
import FormControl from '../../controls/FormControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import ComboBox from '../../inputs/ComboBox'
import VariantsControl from '../../controls/VariantsControl'

const AlertPanel = () => {
  const variant = usePropsSelector('variant')
  const status = usePropsSelector('status')

  const statusProps = ['error', 'success', 'warning', 'info']
  const variantProps = ['subtle', 'solid', 'left-accent', 'top-accent']

  return (
    <>
      <FormControl label="Status" htmlFor="status">
        <ComboBox
          options={statusProps}
          value={status || 'info'}
          name="status"
          editable={false}
        />
      </FormControl>

      <VariantsControl options={variantProps} value={variant || 'subtle'} />
    </>
  )
}

export default memo(AlertPanel)
