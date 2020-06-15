import React, { ReactNode, useState } from 'react'
import { useSelector } from 'react-redux'
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
} from '@chakra-ui/core'
import { isSelectedIdCustomComponent } from '../../../core/selectors/components'

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
  const isCustomComponent = useSelector(isSelectedIdCustomComponent)
  const rightClickHandler = (e: any) => {
    e.preventDefault()
    //Check whether the children is present inside custom components
    if (isCustomComponent) setIsOpen(!isOpen)
  }
  const propInputChangeHandler = (e: any) => setPropName(e.target.value)
  const savePropClickHandler = () => {
    if (propName && propName.length > 1)
      dispatch.components.addCustomProps({
        name: propName,
        targetedProp: htmlFor || '',
      })
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
              {label}
            </FormLabel>
          </PopoverTrigger>
          <PopoverContent
            zIndex={100}
            width="150px"
            backgroundColor="rgba(111, 125, 137,0.9)"
          >
            <PopoverHeader color="#ffcf00" textDecoration="underline">
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
