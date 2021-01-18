import React from 'react'
import { useSelector } from 'react-redux'
import { useDrag } from 'react-dnd'
import { DeleteIcon, DragHandleIcon } from '@chakra-ui/icons'
import { Text, Box, Flex, useToast } from '@chakra-ui/core'
import ActionButton from '../actionButtons/ActionButton'
import useDispatch from '../../hooks/useDispatch'
import {
  getSelectedPageComponents,
  getCustomComponents,
} from '../../core/selectors/components'

const DragItem: React.FC<ComponentItemProps> = ({
  type,
  label,
  isMeta,
  isChild,
  rootParentType,
  custom,
}) => {
  //every custom component type is changed to custom type because only that type will be accepted in the drop.
  const [, drag] = useDrag({
    item: {
      id: type,
      type: custom ? 'Custom' : type,
      isMeta,
      rootParentType,
      custom,
    },
  })
  const dispatch = useDispatch()
  const toast = useToast()
  const components = useSelector(getSelectedPageComponents)
  const customComponents = useSelector(getCustomComponents)

  let boxProps: any = {
    cursor: 'no-drop',
    color: 'whiteAlpha.600',
  }

  boxProps = {
    ref: drag,
    color: 'whiteAlpha.800',
    cursor: 'move',
    _hover: {
      ml: -1,
      mr: 1,
      bg: 'primary.100',
      shadow: 'sm',
      color: 'primary.800',
    },
  }

  if (isChild) {
    boxProps = { ...boxProps, ml: 4 }
  }

  //Check if there is a instance of the custom component in all the pages.
  const isInstancePresent = () => {
    let instanceFound: boolean = false

    if (
      Object.values(components).findIndex(
        component => component.type === type,
      ) !== -1
    ) {
      instanceFound = true
    }

    if (
      Object.values(customComponents).findIndex(
        component => component.type === type && component.id !== type,
      ) !== -1
    ) {
      instanceFound = true
    }

    return instanceFound
  }

  const deleteComponentHandler = (componentType: string) => {
    if (isInstancePresent())
      toast({
        title: 'Error in deletion.',
        description: 'Instance of the custom component exists.',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      })
    else {
      dispatch.components.deleteCustomComponent(componentType)
      toast({
        title: 'Success.',
        description: 'Component had been deleted Successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      })
    }
  }

  return (
    <Flex my={1}>
      <Box
        boxSizing="border-box"
        transition="margin 200ms"
        rounded="md"
        display="flex"
        alignItems="center"
        {...boxProps}
        width="95%"
        p={1}
      >
        <DragHandleIcon fontSize="xs" mr={2} color="neutrals.900" />

        <Text
          letterSpacing="wide"
          fontSize="sm"
          textTransform="capitalize"
          color="neutrals.900"
        >
          {label}
        </Text>
      </Box>

      {custom && (
        <ActionButton
          label="Delete component"
          icon={<DeleteIcon />}
          onClick={() => deleteComponentHandler(type)}
        />
      )}
    </Flex>
  )
}

export default DragItem
