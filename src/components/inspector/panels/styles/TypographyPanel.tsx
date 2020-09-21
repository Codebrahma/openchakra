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
import { ComboboxOption } from '@reach/combobox'
import InputSuggestion from '../../inputs/InputSuggestion'
import { useForm } from '../../../../hooks/useForm'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import useCustomTheme from '../../../../hooks/useCustomTheme'

import '@reach/combobox/styles.css'

const TextPanel = () => {
  const { setValue, setValueFromEvent } = useForm()
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
          icon={GoItalic}
          onClick={() => {
            setValue('fontStyle', fontStyle === 'italic' ? null : 'italic')
          }}
          size="xs"
          variantColor={fontStyle === 'italic' ? 'whatsapp' : 'gray'}
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
          <SliderTrack />
          <SliderFilledTrack />
          <SliderThumb />
        </Slider>
      </FormControl>

      <FormControl label="Text align">
        <ButtonGroup size="xs" isAttached>
          <IconButton
            aria-label="bold"
            icon={MdFormatAlignLeft}
            onClick={() => {
              setValue('textAlign', 'left')
            }}
            variantColor={textAlign === 'left' ? 'whatsapp' : 'gray'}
            variant={textAlign === 'left' ? 'solid' : 'outline'}
          />

          <IconButton
            aria-label="italic"
            icon={MdFormatAlignCenter}
            onClick={() => {
              setValue('textAlign', 'center')
            }}
            variantColor={textAlign === 'center' ? 'whatsapp' : 'gray'}
            variant={textAlign === 'center' ? 'solid' : 'outline'}
          />

          <IconButton
            aria-label="italic"
            icon={MdFormatAlignRight}
            onClick={() => {
              setValue('textAlign', 'right')
            }}
            variantColor={textAlign === 'right' ? 'whatsapp' : 'gray'}
            variant={textAlign === 'right' ? 'solid' : 'outline'}
          />

          <IconButton
            aria-label="italic"
            icon={MdFormatAlignJustify}
            onClick={() => {
              setValue('textAlign', 'justify')
            }}
            variantColor={textAlign === 'justify' ? 'whatsapp' : 'gray'}
            variant={textAlign === 'justify' ? 'solid' : 'outline'}
          />
        </ButtonGroup>
      </FormControl>

      <FormControl label="Font size" htmlFor="fontSize">
        <InputSuggestion
          value={fontSize}
          handleChange={setValueFromEvent}
          name="fontSize"
        >
          {Object.keys(theme.fontSizes).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
      </FormControl>

      <ColorsControl withFullColor enableHues name="color" label="Color" />

      <FormControl label="Line height" htmlFor="lineHeight">
        <InputSuggestion
          value={lineHeight}
          handleChange={setValueFromEvent}
          name="lineHeight"
        >
          {Object.keys(theme.lineHeights).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
      </FormControl>

      <FormControl label="Letter spacing" htmlFor="letterSpacing">
        <InputSuggestion
          value={letterSpacing}
          handleChange={setValueFromEvent}
          name="letterSpacing"
        >
          {Object.keys(theme.letterSpacings).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
      </FormControl>
    </>
  )
}

export default memo(TextPanel)