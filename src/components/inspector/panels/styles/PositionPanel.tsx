import React, { memo } from 'react'
import {
  Select,
  Input,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/core'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  ArrowUpIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons'

import FormControl from '../../controls/FormControl'
import { useForm } from '../../../../hooks/useForm'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import ComboBox from '../../inputs/ComboBox'
import useCustomTheme from '../../../../hooks/useCustomTheme'

const PositionPanel = () => {
  const { setValue } = useForm()
  const theme = useCustomTheme()
  const { propId: positionId, propValue: positionValue } = usePropsSelector(
    'position',
  )
  const { propId: leftId, propValue: leftValue } = usePropsSelector('left')
  const { propId: rightId, propValue: rightValue } = usePropsSelector('right')
  const { propId: bottomId, propValue: bottomValue } = usePropsSelector(
    'bottom',
  )
  const { propId: topId, propValue: topValue } = usePropsSelector('top')
  const { propId: zIndexId, propValue: zIndexValue } = usePropsSelector(
    'zIndex',
  )

  return (
    <>
      <FormControl label="Position">
        <Select
          id={positionId}
          name="position"
          size="sm"
          value={positionValue}
          onChange={e => setValue(positionId, 'position', e.target.value)}
        >
          <option>static</option>
          <option>relative</option>
          <option>absolute</option>
          <option>fixed</option>
          <option>sticky</option>
        </Select>
      </FormControl>

      <FormControl label="z-index" htmlFor="zIndex">
        <ComboBox
          id={zIndexId}
          value={zIndexValue}
          name="zIndex"
          options={Object.keys(theme.zIndices)}
        />
      </FormControl>

      <SimpleGrid columns={2} spacing={1}>
        <InputGroup size="sm">
          <InputLeftElement
            children={<ArrowBackIcon color="gray.300" fontSize="md" />}
          />
          <Input
            placeholder="left"
            size="sm"
            type="text"
            name="left"
            id={leftId}
            value={leftValue}
            onChange={e => setValue(leftId, 'left', e.target.value)}
            autoComplete="off"
          />
        </InputGroup>

        <InputGroup size="sm">
          <InputLeftElement
            children={<ArrowForwardIcon color="gray.300" fontSize="md" />}
          />
          <Input
            placeholder="right"
            size="sm"
            type="text"
            id={rightId}
            value={rightValue}
            name="right"
            onChange={e => setValue(rightId, 'right', e.target.value)}
            autoComplete="off"
          />
        </InputGroup>

        <InputGroup size="sm">
          <InputLeftElement
            children={<ArrowUpIcon color="gray.300" fontSize="md" />}
          />
          <Input
            placeholder="top"
            size="sm"
            type="text"
            id={topId}
            value={topValue}
            name="top"
            onChange={e => setValue(topId, 'top', e.target.value)}
            autoComplete="off"
          />
        </InputGroup>

        <InputGroup size="sm">
          <InputLeftElement
            children={<ChevronDownIcon color="gray.300" fontSize="md" />}
          />
          <Input
            placeholder="bottom"
            size="sm"
            type="text"
            id={bottomId}
            value={bottomValue}
            name="bottom"
            onChange={e => setValue(bottomId, 'bottom', e.target.value)}
            autoComplete="off"
          />
        </InputGroup>
      </SimpleGrid>
    </>
  )
}

export default memo(PositionPanel)
