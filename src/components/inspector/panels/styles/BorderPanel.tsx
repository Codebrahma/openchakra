import React, { memo } from 'react'
import FormControl from '../../controls/FormControl'
import ComboBox from '../../inputs/ComboBox'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import useCustomTheme from '../../../../hooks/useCustomTheme'

const BorderPanel = () => {
  const theme = useCustomTheme()

  const border = usePropsSelector('border')
  const borderRadius = usePropsSelector('borderRadius')

  return (
    <>
      <FormControl label="Border" htmlFor="border">
        <ComboBox
          options={Object.keys(theme.borders)}
          value={border}
          name="border"
        />
      </FormControl>
      <FormControl label="Border Radius" htmlFor="borderRadius">
        <ComboBox
          value={borderRadius}
          name="borderRadius"
          options={Object.keys(theme.radii)}
        />
      </FormControl>
    </>
  )
}

export default memo(BorderPanel)
