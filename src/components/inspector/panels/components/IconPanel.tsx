import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import ComboBox from '../../inputs/ComboBox'
import theme from '../../../../theme/theme'
import FormControl from '../../controls/FormControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import IconControl from '../../controls/IconControl'

const IconPanel = () => {
  const fontSize = usePropsSelector('fontSize')

  return (
    <>
      <IconControl label="Icon" name="as" />

      <FormControl label="Font size" htmlFor="fontSize">
        <ComboBox
          options={Object.keys(theme.fontSizes)}
          value={fontSize}
          name="fontSize"
        />
      </FormControl>

      <ColorsControl withFullColor label="Color" name="color" enableHues />
    </>
  )
}

export default memo(IconPanel)
