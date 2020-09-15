import React, { useState } from 'react'
import { Input, Button, Flex, Text, Box } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import { getLoadedFonts } from '../../../core/selectors/app'
import useDispatch from '../../../hooks/useDispatch'
import loadFonts from '../../../utils/loadFonts'
import { IoMdClose } from 'react-icons/io'
import { FiCheck } from 'react-icons/fi'

const titleCase = (str: string) => {
  const splitStr = str.toLowerCase().split(' ')
  for (let i = 0; i < splitStr.length; i++)
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)

  return splitStr.join(' ')
}

const DownloadFontPanel = () => {
  const [font, setFonts] = useState('')
  const [message, setMessage] = useState('')
  const [isError, toggleIsError] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const loadedFonts = useSelector(getLoadedFonts)
  const dispatch = useDispatch()

  const fontsChangeHandler = (e: any) => setFonts(e.target.value)
  const messageChangeHandler = (message: string) => setMessage(message)

  const onActive = () => {
    setLoading(false)
    messageChangeHandler('Loaded successfully')
    toggleIsError(false)
    dispatch.app.addFonts(titleCase(font))
  }
  const onInActive = () => {
    setLoading(false)
    messageChangeHandler('Error in loading fonts')
    toggleIsError(true)
  }
  const clickHandler = () => {
    const fontName = titleCase(font)

    if (fontName.length > 0) {
      if (
        loadedFonts &&
        loadedFonts.length > 0 &&
        loadedFonts.indexOf(fontName) !== -1
      ) {
        messageChangeHandler('Font already exists')
        toggleIsError(true)
      } else {
        messageChangeHandler('')
        toggleIsError(false)
        setLoading(true)
        loadFonts([fontName], onActive, onInActive)
      }
    } else {
      messageChangeHandler('Type any font name')
      toggleIsError(true)
    }
  }

  return (
    <Flex direction="column">
      <Input
        value={font}
        onChange={fontsChangeHandler}
        fontSize="14px"
        _placeholder={{
          fontSize: '12px',
        }}
        placeholder="Enter Font Name"
        margin="20px 0"
        onKeyDown={(e: any) => {
          if (e.keyCode === 13) clickHandler()
        }}
      />

      <Button
        backgroundColor="#2e3748"
        color="white"
        width="150px"
        alignSelf="center"
        fontSize="14px"
        _hover={{
          backgroundColor: 'black',
        }}
        onClick={clickHandler}
        isLoading={isLoading}
      >
        Load
      </Button>
      {message.length > 0 && (
        <Flex alignSelf="center" marginTop="20px" fontSize="14px">
          <Box
            as={isError ? IoMdClose : FiCheck}
            size="22px"
            color={isError ? 'red.400' : 'green.400'}
            mr="5px"
          />
          <Text>{message}</Text>
        </Flex>
      )}
    </Flex>
  )
}

export default DownloadFontPanel
