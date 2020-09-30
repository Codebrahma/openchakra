import React, { FunctionComponent } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Button,
  LightMode,
  Box,
} from '@chakra-ui/core'
import ActionButton from './inspector/ActionButton'
import { FiTrash2 } from 'react-icons/fi'
import { CheckIcon } from '@chakra-ui/icons'

const ClearOptionPopover: FunctionComponent<{
  name: string
  message: string
  dispatchAction: any
}> = ({ name, message, dispatchAction }) => {
  return (
    <Popover>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Box>
              <ActionButton
                icon={<FiTrash2 />}
                label={name}
                size="sm"
                color="black"
              />
            </Box>
          </PopoverTrigger>
          <LightMode>
            <PopoverContent zIndex={100}>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Are you sure?</PopoverHeader>
              <PopoverBody fontSize="sm">{message}</PopoverBody>
              <PopoverFooter display="flex" justifyContent="flex-end">
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  rightIcon={<CheckIcon />}
                  onClick={() => {
                    dispatchAction()
                    if (onClose) {
                      onClose()
                    }
                  }}
                >
                  Yes, clear
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </LightMode>
        </>
      )}
    </Popover>
  )
}

export default ClearOptionPopover
