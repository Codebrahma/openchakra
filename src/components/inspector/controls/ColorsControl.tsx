import React, { ReactNode, useState, memo } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  Grid,
  Box,
  PopoverBody,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Input,
  Tooltip,
} from '@chakra-ui/core'
import FormControl from './FormControl'
import { useForm } from '../../../hooks/useForm'
import omit from 'lodash/omit'
import ColorPicker from 'coloreact'
import 'react-color-picker/index.css'
import usePropsSelector from '../../../hooks/usePropsSelector'
import useCustomTheme from '../../../hooks/useCustomTheme'

type ColorControlPropsType = {
  name: string
  label: string | ReactNode
  enableHues?: boolean
  withFullColor?: boolean
}

const ColorsControl = (props: ColorControlPropsType) => {
  const { setValue, setValueFromEvent } = useForm()
  const [hue, setHue] = useState(500)
  const [color, setColor] = useState('')
  const value = usePropsSelector(props.name)
  const theme = useCustomTheme()

  const themeColors: any = omit(theme.colors, ['transparent', 'current'])

  const IconButtonProps: any =
    props.name === 'colorScheme'
      ? { colorScheme: value }
      : {
          bg: value,
        }

  const huesPicker = (
    <>
      <Grid mb={2} templateColumns="repeat(5, 1fr)" gap={0}>
        {Object.keys(themeColors).map(colorName => {
          const enableHues =
            props.enableHues && typeof themeColors[colorName] !== 'string'
          return (
            <Tooltip
              label={colorName}
              zIndex={9999}
              hasArrow
              borderRadius="md"
              key={colorName}
            >
              <Box
                border="1px solid rgba(0,0,0,0.1)"
                _hover={{ shadow: 'lg' }}
                cursor="pointer"
                bg={
                  enableHues
                    ? themeColors[colorName][hue]
                    : typeof themeColors[colorName] !== 'string'
                    ? themeColors[colorName][hue]
                    : themeColors[colorName]
                }
                onClick={() => {
                  setColor(colorName)
                  setValue(
                    props.name,
                    enableHues ? `${colorName}.${hue}` : colorName,
                  )
                }}
                m="2px"
                mt={2}
                rounded="full"
                height="30px"
                width="30px"
              />
            </Tooltip>
          )
        })}
      </Grid>

      {props.enableHues && (
        <Slider
          onChange={value => {
            value = value === 0 ? 50 : value
            setHue(value)
            if (color.length > 0) setValue(props.name, `${color}.${value}`)
          }}
          min={0}
          max={900}
          step={100}
          value={hue}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={8}>
            <Box rounded="full" fontSize="xs">
              {hue}
            </Box>
          </SliderThumb>
        </Slider>
      )}
    </>
  )

  return (
    <FormControl label={props.label} htmlFor={props.name}>
      <Popover placement="bottom">
        <PopoverTrigger>
          <IconButton
            mr={2}
            shadow="md"
            border={value ? 'none' : '2px solid grey'}
            isRound
            aria-label="Color"
            size="xs"
            {...IconButtonProps}
          >
            {props.label}
          </IconButton>
        </PopoverTrigger>
        <PopoverContent width="200px" zIndex="modal">
          <PopoverArrow />
          <PopoverBody>
            {props.withFullColor ? (
              <Tabs size="sm" variant="soft-rounded" colorScheme="green">
                <TabList>
                  <Tab>Theme</Tab>
                  <Tab>All</Tab>
                </TabList>
                <TabPanels mt={4}>
                  <TabPanel p={0}>{huesPicker}</TabPanel>

                  <TabPanel p={0}>
                    <Box position="relative" height="150px">
                      <ColorPicker
                        color={value}
                        onChange={(color: any) => {
                          setValue(props.name, `#${color.hex}`)
                        }}
                      />
                      );
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            ) : (
              huesPicker
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Input
        width="100px"
        size="sm"
        name={props.name}
        onChange={setValueFromEvent}
        value={value}
      />
    </FormControl>
  )
}

export default memo(ColorsControl)
