import React, { memo } from 'react'
import { FormLabel, SimpleGrid, Box } from '@chakra-ui/core'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import ComboBox from '../../inputs/ComboBox'
import useCustomTheme from '../../../../hooks/useCustomTheme'

type PaddingPanelPropsType = {
  type: 'margin' | 'padding'
}

const ATTRIBUTES = {
  margin: {
    all: 'm',
    left: 'ml',
    right: 'mr',
    bottom: 'mb',
    top: 'mt',
  },
  padding: {
    all: 'p',
    left: 'pl',
    right: 'pr',
    bottom: 'pb',
    top: 'pt',
  },
}

const PaddingPanel = ({ type }: PaddingPanelPropsType) => {
  const { propId: allId, propValue: allValue } = usePropsSelector(
    ATTRIBUTES[type].all,
  )
  const { propId: leftId, propValue: leftValue } = usePropsSelector(
    ATTRIBUTES[type].left,
  )
  const { propId: rightId, propValue: rightValue } = usePropsSelector(
    ATTRIBUTES[type].right,
  )
  const { propId: bottomId, propValue: bottomValue } = usePropsSelector(
    ATTRIBUTES[type].bottom,
  )
  const { propId: topId, propValue: topValue } = usePropsSelector(
    ATTRIBUTES[type].top,
  )
  const theme = useCustomTheme()

  return (
    <Box mb={4}>
      <FormLabel fontSize="xs" htmlFor="width" textTransform="capitalize">
        {type}
      </FormLabel>
      <Box mb="5px">
        <ComboBox
          id={allId}
          value={allValue || ''}
          name={ATTRIBUTES[type].all}
          placeholder="All"
          options={Object.keys(theme.space)}
        />
      </Box>

      <SimpleGrid columns={2} spacing={1}>
        <ComboBox
          id={leftId}
          value={leftValue || ''}
          name={ATTRIBUTES[type].left}
          placeholder="Left"
          options={Object.keys(theme.space)}
        />

        <ComboBox
          id={rightId}
          value={rightValue || ''}
          name={ATTRIBUTES[type].right}
          placeholder="Right"
          options={Object.keys(theme.space)}
        />

        <ComboBox
          id={topId}
          value={topValue || ''}
          name={ATTRIBUTES[type].top}
          placeholder="Top"
          options={Object.keys(theme.space)}
        />

        <ComboBox
          id={bottomId}
          value={bottomValue || ''}
          name={ATTRIBUTES[type].bottom}
          placeholder="Bottom"
          options={Object.keys(theme.space)}
        />
      </SimpleGrid>
    </Box>
  )
}

export default memo(PaddingPanel)
