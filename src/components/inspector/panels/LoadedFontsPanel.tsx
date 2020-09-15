import React from 'react'
import { useSelector } from 'react-redux'
import { Flex, Text, Icon, PseudoBox } from '@chakra-ui/core'

import useDispatch from '../../../hooks/useDispatch'
import { getLoadedFonts } from '../../../core/selectors/app'

const LoadedFontsPanel = () => {
  const dispatch = useDispatch()
  const loadedFonts = useSelector(getLoadedFonts)

  const deleteFontHandler = (font: string) => dispatch.app.removeFont(font)

  return (
    <Flex direction="column">
      {loadedFonts ? (
        loadedFonts.map(font => (
          <PseudoBox
            display="flex"
            alignItems="center"
            p="10px 5px"
            justifyContent="space-between"
            _hover={{
              backgroundColor: 'rgba(0,0,0,0.04)',
            }}
            key={font}
          >
            <Flex alignItems="center">
              <Icon fontSize="sm" name="arrow-right" color="gray.300" />
              <Text fontSize="14px" pl={2}>
                {font}
              </Text>
            </Flex>
            <Icon
              fontSize="10px"
              name="close"
              color="red.500"
              cursor="pointer"
              onClick={() => deleteFontHandler(font)}
            />
          </PseudoBox>
        ))
      ) : (
        <Text
          fontSize="14px"
          color="#718096"
          textAlign="center"
          marginTop="15px"
        >
          No font had been loaded yet.
        </Text>
      )}
      <Text fontSize="10px" color="#718096" textAlign="center" marginTop="15px">
        Note : Please reload the page when you remove font.
      </Text>
    </Flex>
  )
}

export default LoadedFontsPanel
