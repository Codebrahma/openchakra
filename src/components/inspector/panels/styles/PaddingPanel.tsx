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
  const all = usePropsSelector(ATTRIBUTES[type].all)
  const left = usePropsSelector(ATTRIBUTES[type].left)
  const right = usePropsSelector(ATTRIBUTES[type].right)
  const bottom = usePropsSelector(ATTRIBUTES[type].bottom)
  const top = usePropsSelector(ATTRIBUTES[type].top)
  const theme = useCustomTheme()

  return (
    <Box mb={4}>
      <FormLabel fontSize="xs" htmlFor="width" textTransform="capitalize">
        {type}
      </FormLabel>
      <Box mb="5px">
        <ComboBox
          value={all || ''}
          name={ATTRIBUTES[type].all}
          placeholder="All"
          options={Object.keys(theme.space)}
        />
      </Box>

      <SimpleGrid columns={2} spacing={1}>
        <ComboBox
          value={left || ''}
          name={ATTRIBUTES[type].left}
          placeholder="Left"
          options={Object.keys(theme.space)}
        />

        <ComboBox
          value={right || ''}
          name={ATTRIBUTES[type].right}
          placeholder="Right"
          options={Object.keys(theme.space)}
        />

        <ComboBox
          value={top || ''}
          name={ATTRIBUTES[type].top}
          placeholder="Top"
          options={Object.keys(theme.space)}
        />

        <ComboBox
          value={bottom || ''}
          name={ATTRIBUTES[type].bottom}
          placeholder="Bottom"
          options={Object.keys(theme.space)}
        />
      </SimpleGrid>
    </Box>
  )
}

export default memo(PaddingPanel)
