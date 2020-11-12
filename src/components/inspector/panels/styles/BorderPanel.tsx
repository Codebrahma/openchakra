import React, { memo } from 'react'
import FormControl from '../../controls/FormControl'
import ComboBox from '../../inputs/ComboBox'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import useCustomTheme from '../../../../hooks/useCustomTheme'

const BorderPanel = () => {
  const theme = useCustomTheme()

  const { propId: borderId, propValue: borderValue } = usePropsSelector(
    'border',
  )
  const {
    propId: borderRadiusId,
    propValue: borderRadiusValue,
  } = usePropsSelector('borderRadius')

  return (
    <>
      <FormControl label="Border" htmlFor="border">
        <ComboBox
          id={borderId}
          options={Object.keys(theme.borders)}
          value={borderValue}
          name="border"
        />
      </FormControl>
      <FormControl label="Border Radius" htmlFor="borderRadius">
        <ComboBox
          id={borderRadiusId}
          value={borderRadiusValue}
          name="borderRadius"
          options={Object.keys(theme.radii)}
        />
      </FormControl>
    </>
  )
}

export default memo(BorderPanel)
