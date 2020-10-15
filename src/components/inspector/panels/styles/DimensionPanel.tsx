import React, { memo } from 'react'
import { SimpleGrid, Select } from '@chakra-ui/core'
import FormControl from '../../controls/FormControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import { useForm } from '../../../../hooks/useForm'
import ComboBox from '../../inputs/ComboBox'
import useCustomTheme from '../../../../hooks/useCustomTheme'

const DimensionPanel = () => {
  const { setValueFromEvent } = useForm()
  const overflow = usePropsSelector('overflow')
  const width = usePropsSelector('width')
  const height = usePropsSelector('height')
  const minWidth = usePropsSelector('minWidth')
  const minHeight = usePropsSelector('minHeight')
  const maxWidth = usePropsSelector('maxWidth')
  const maxHeight = usePropsSelector('maxHeight')
  const theme = useCustomTheme()

  return (
    <>
      <FormControl label="Width" htmlFor="width">
        <ComboBox
          value={width}
          name="width"
          options={Object.keys(theme.sizes)}
        />
      </FormControl>
      <FormControl label="Height" htmlFor="height">
        <ComboBox
          value={height}
          name="height"
          options={Object.keys(theme.sizes)}
        />
      </FormControl>
      <SimpleGrid columns={2} spacing={1} m="10px 0">
        <ComboBox
          value={minWidth}
          name="minWidth"
          placeholder="Min width"
          options={Object.keys(theme.sizes)}
        />

        <ComboBox
          value={minHeight}
          name="minHeight"
          placeholder="Min Height"
          options={Object.keys(theme.sizes)}
        />

        <ComboBox
          value={maxWidth}
          name="maxWidth"
          placeholder="Max Width"
          options={Object.keys(theme.sizes)}
        />

        <ComboBox
          value={maxHeight}
          name="maxHeight"
          placeholder="Max Height"
          options={Object.keys(theme.sizes)}
        />
      </SimpleGrid>
      <FormControl label="Overflow">
        <Select
          size="sm"
          value={overflow || ''}
          onChange={setValueFromEvent}
          name="overflow"
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
