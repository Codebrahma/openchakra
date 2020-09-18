import React, { ReactNode, useState } from 'react'
import useDispatch from '../../.././hooks/useDispatch'
import {
  FormLabel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Button,
  Input,
  Tooltip,
  useToast,
} from '@chakra-ui/core'

type FormControlPropType = {
  label: ReactNode
  htmlFor?: string
  hasColumn?: boolean
}

const PopOverControl: React.FC<FormControlPropType> = ({
  label,
  htmlFor,
  hasColumn,
}) => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [propName, setPropName] = useState('')
  const toast = useToast()

  const rightClickHandler = (e: any) => {
    e.preventDefault()
    //Check whether the children is present inside custom component
    setIsOpen(true)
  }
  const propInputChangeHandler = (e: any) => setPropName(e.target.value)
  const savePropClickHandler = () => {
    if (propName && propName.length > 1) {
      if (propName === 'children')
        toast({
          title: 'Custom Prop-name not accepted',
          description:
            'The name children is not allowed as the custom prop-name.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
      else
        dispatch.components.exposeProp({
          name: propName,
          targetedProp: htmlFor || '',
        })
    }
  }
  return (
    <Popover
      isOpen={isOpen}
      placement="bottom-start"
      closeOnBlur={true}
      onClose={() => setIsOpen(false)}
    >
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <FormLabel
              p={0}
              mr={2}
              color="gray.500"
              lineHeight="1rem"
              width={hasColumn ? '2.5rem' : '90px'}
              fontSize="xs"
              htmlFor={htmlFor}
              onContextMenu={rightClickHandler}
            >
              <Tooltip
                zIndex={100}
                hasArrow
                bg="black"
                aria-label="Right click to expose"
                label="Right click to expose"
              >
                {label}
              </Tooltip>
            </FormLabel>
          </PopoverTrigger>
          <PopoverContent
            zIndex={100}
            width="150px"
            backgroundColor="rgba(26, 32, 44,0.85)"
          >
            <PopoverHeader
              color="yellow.100"
              textDecoration="underline"
              fontWeight="bold"
              fontSize="14px"
            >
              Expose as
            </PopoverHeader>
            <PopoverBody fontSize="sm">
              <Input
                placeholder="Prop name"
                _placeholder={{ fontSize: 14 }}
                fontSize="14px"
                onChange={propInputChangeHandler}
                value={propName}
                onKeyDown={(e: any) => {
                  if (e.keyCode === 13) {
                    savePropClickHandler()
                    if (onClose) onClose()
                  }
                }}
              />
            </PopoverBody>
            <PopoverFooter display="flex" justifyContent="flex-end">
              <Button
                height="30px"
                p="0 10px"
                fontSize="14px"
                backgroundColor="white"
                onClick={() => {
                  savePropClickHandler()
                  if (onClose) onClose()
                }}
              >
                Add
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </>
      )}
    </Popover>
  )
}

export default PopOverControl
