import React, { memo } from 'react'
import {
  IconButton,
  ButtonGroup,
  Slider,
  SliderThumb,
  SliderTrack,
  SliderFilledTrack,
} from '@chakra-ui/core'
import { GoItalic } from 'react-icons/go'
import {
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
} from 'react-icons/md'

import ColorsControl from '../../controls/ColorsControl'
import FormControl from '../../controls/FormControl'
import ComboBox from '../../inputs/ComboBox'
import { useForm } from '../../../../hooks/useForm'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import useCustomTheme from '../../../../hooks/useCustomTheme'

const TextPanel = () => {
  const { setValue } = useForm()
  const theme = useCustomTheme()

  const { propId: fontWeightId, propValue: fontWeightValue } = usePropsSelector(
    'fontWeight',
  )
  const { propId: fontStyleId, propValue: fontStyleValue } = usePropsSelector(
    'fontStyle',
  )
  const { propId: textAlignId, propValue: textAlignValue } = usePropsSelector(
    'textAlign',
  )
  const { propId: fontSizeId, propValue: fontSizeValue } = usePropsSelector(
    'fontSize',
  )
  const {
    propId: letterSpacingId,
    propValue: letterSpacingValue,
  } = usePropsSelector('letterSpacing')
  const { propId: lineHeightId, propValue: lineHeightValue } = usePropsSelector(
    'lineHeight',
  )

  return (
    <>
      <FormControl label="Style">
        <IconButton
          aria-label="italic"
          icon={<GoItalic />}
          onClick={() => {
            setValue(
              fontStyleId,
              'fontStyle',
              fontStyleValue === 'italic' ? null : 'italic',
            )
          }}
          size="xs"
          colorScheme={fontStyleValue === 'italic' ? 'whatsapp' : 'gray'}
          variant={fontStyleValue === 'italic' ? 'solid' : 'outline'}
        >
          Italic
        </IconButton>
      </FormControl>
      <FormControl label="Font Weight">
        <Slider
          min={100}
          max={900}
          step={100}
          onChange={value => setValue(fontWeightId, 'fontWeight', value)}
          value={fontWeightValue ? fontWeightValue : 100}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>

      <FormControl label="Text align">
        <ButtonGroup size="xs" isAttached>
          <IconButton
            aria-label="bold"
            icon={<MdFormatAlignLeft />}
            onClick={() => {
              setValue(textAlignId, 'textAlign', 'left')
            }}
            colorScheme={textAlignValue === 'left' ? 'whatsapp' : 'gray'}
            variant={textAlignValue === 'left' ? 'solid' : 'outline'}
          />

          <IconButton
            aria-label="italic"
            icon={<MdFormatAlignCenter />}
            onClick={() => {
              setValue(textAlignId, 'textAlign', 'center')
            }}
            colorScheme={textAlignValue === 'center' ? 'whatsapp' : 'gray'}
            variant={textAlignValue === 'center' ? 'solid' : 'outline'}
          />

          <IconButton
            aria-label="italic"
            icon={<MdFormatAlignRight />}
            onClick={() => {
              setValue(textAlignId, 'textAlign', 'right')
            }}
            colorScheme={textAlignValue === 'right' ? 'whatsapp' : 'gray'}
            variant={textAlignValue === 'right' ? 'solid' : 'outline'}
          />

          <IconButton
            aria-label="italic"
            icon={<MdFormatAlignJustify />}
            onClick={() => {
              setValue(textAlignId, 'textAlign', 'justify')
            }}
            colorScheme={textAlignValue === 'justify' ? 'whatsapp' : 'gray'}
            variant={textAlignValue === 'justify' ? 'solid' : 'outline'}
          />
        </ButtonGroup>
      </FormControl>

      <FormControl label="Font size" htmlFor="fontSize">
        <ComboBox
          id={fontSizeId}
          value={fontSizeValue}
          name="fontSize"
          options={Object.keys(theme.fontSizes)}
        />
      </FormControl>

      <ColorsControl withFullColor enableHues name="color" label="Color" />

      <FormControl label="Line height" htmlFor="lineHeight">
        <ComboBox
          id={lineHeightId}
          value={lineHeightValue}
          name="lineHeight"
          options={Object.keys(theme.lineHeights)}
        />
      </FormControl>

      <FormControl label="Letter spacing" htmlFor="letterSpacing">
        <ComboBox
          id={letterSpacingId}
          value={letterSpacingValue}
          name="letterSpacing"
          options={Object.keys(theme.letterSpacings)}
        />
      </FormControl>
    </>
  )
}

export default memo(TextPanel)
