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
} from '@chakra-ui/core'

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
            <Button ml={4} rightIcon="small-close" size="xs" variant="ghost">
              {name}
            </Button>
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
                  variantColor="red"
                  rightIcon="check"
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
