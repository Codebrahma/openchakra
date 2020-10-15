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

import '@reach/combobox/styles.css'

const TextPanel = () => {
  const { setValue } = useForm()
  const theme = useCustomTheme()

  const fontWeight = usePropsSelector('fontWeight')
  const fontStyle = usePropsSelector('fontStyle')
  const textAlign = usePropsSelector('textAlign')
  const fontSize = usePropsSelector('fontSize')
  const letterSpacing = usePropsSelector('letterSpacing')
  const lineHeight = usePropsSelector('lineHeight')

  return (
    <>
      <FormControl label="Style">
        <IconButton
          aria-label="italic"
          icon={<GoItalic />}
          onClick={() => {
            setValue('fontStyle', fontStyle === 'italic' ? null : 'italic')
          }}
          size="xs"
          colorScheme={fontStyle === 'italic' ? 'whatsapp' : 'gray'}
          variant={fontStyle === 'italic' ? 'solid' : 'outline'}
        >
          Italic
        </IconButton>
      </FormControl>
      <FormControl label="Font Weight">
        <Slider
          min={100}
          max={900}
          step={100}
          onChange={value => setValue('fontWeight', value)}
          value={fontWeight ? fontWeight : 100}
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
              setValue('textAlign', 'left')
            }}
            colorScheme={textAlign === 'left' ? 'whatsapp' : 'gray'}
            variant={textAlign === 'left' ? 'solid' : 'outline'}
          />

          <IconButton
            aria-label="italic"
            icon={<MdFormatAlignCenter />}
            onClick={() => {
              setValue('textAlign', 'center')
            }}
            colorScheme={textAlign === 'center' ? 'whatsapp' : 'gray'}
            variant={textAlign === 'center' ? 'solid' : 'outline'}
          />

          <IconButton
            aria-label="italic"
            icon={<MdFormatAlignRight />}
            onClick={() => {
              setValue('textAlign', 'right')
            }}
            colorScheme={textAlign === 'right' ? 'whatsapp' : 'gray'}
            variant={textAlign === 'right' ? 'solid' : 'outline'}
          />

          <IconButton
            aria-label="italic"
            icon={<MdFormatAlignJustify />}
            onClick={() => {
              setValue('textAlign', 'justify')
            }}
            colorScheme={textAlign === 'justify' ? 'whatsapp' : 'gray'}
            variant={textAlign === 'justify' ? 'solid' : 'outline'}
          />
        </ButtonGroup>
      </FormControl>

      <FormControl label="Font size" htmlFor="fontSize">
        <ComboBox
          value={fontSize}
          name="fontSize"
          options={Object.keys(theme.fontSizes)}
        />
      </FormControl>

      <ColorsControl withFullColor enableHues name="color" label="Color" />

      <FormControl label="Line height" htmlFor="lineHeight">
        <ComboBox
          value={lineHeight}
          name="lineHeight"
          options={Object.keys(theme.lineHeights)}
        />
      </FormControl>

      <FormControl label="Letter spacing" htmlFor="letterSpacing">
        <ComboBox
          value={letterSpacing}
          name="letterSpacing"
          options={Object.keys(theme.letterSpacings)}
        />
      </FormControl>
    </>
  )
}

export default memo(TextPanel)
