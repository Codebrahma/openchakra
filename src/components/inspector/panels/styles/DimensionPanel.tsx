import React, { memo } from 'react'
import { SimpleGrid, Select } from '@chakra-ui/core'
import FormControl from '../../controls/FormControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import { useForm } from '../../../../hooks/useForm'
import ComboBox from '../../inputs/ComboBox'
import useCustomTheme from '../../../../hooks/useCustomTheme'

const DimensionPanel = () => {
  const { setValue } = useForm()
  const { propId: overflowId, propValue: overflowValue } = usePropsSelector(
    'overflow',
  )
  const { propId: widthId, propValue: widthValue } = usePropsSelector('width')
  const { propId: heightId, propValue: heightValue } = usePropsSelector(
    'height',
  )
  const { propId: minWidthId, propValue: minWidthValue } = usePropsSelector(
    'minWidth',
  )
  const { propId: minHeightId, propValue: minHeightValue } = usePropsSelector(
    'minHeight',
  )
  const { propId: maxWidthId, propValue: maxWidthValue } = usePropsSelector(
    'maxWidth',
  )
  const { propId: maxHeightId, propValue: maxHeightValue } = usePropsSelector(
    'maxHeight',
  )
  const theme = useCustomTheme()

  return (
    <>
      <FormControl label="Width" htmlFor="width">
        <ComboBox
          id={widthId}
          value={widthValue}
          name="width"
          options={Object.keys(theme.sizes)}
        />
      </FormControl>
      <FormControl label="Height" htmlFor="height">
        <ComboBox
          id={heightId}
          value={heightValue}
          name="height"
          options={Object.keys(theme.sizes)}
        />
      </FormControl>
      <SimpleGrid columns={2} spacing={1} m="10px 0">
        <ComboBox
          id={minWidthId}
          value={minWidthValue}
          name="minWidth"
          placeholder="Min width"
          options={Object.keys(theme.sizes)}
        />

        <ComboBox
          id={minHeightId}
          value={minHeightValue}
          name="minHeight"
          placeholder="Min Height"
          options={Object.keys(theme.sizes)}
        />

        <ComboBox
          id={maxWidthId}
          value={maxWidthValue}
          name="maxWidth"
          placeholder="Max Width"
          options={Object.keys(theme.sizes)}
        />

        <ComboBox
          id={maxHeightId}
          value={maxHeightValue}
          name="maxHeight"
          placeholder="Max Height"
          options={Object.keys(theme.sizes)}
        />
      </SimpleGrid>
      <FormControl label="Overflow">
        <Select
          size="sm"
          value={overflowValue || ''}
          onChange={e => setValue(overflowId, 'overflow', e.target.value)}
        >
          <option>visible</option>
          <option>hidden</option>
          <option>scroll</option>
        </Select>
      </FormControl>
    </>
  )
}

export default memo(DimensionPanel)
