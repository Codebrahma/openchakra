import React from 'react'
import { useSelector } from 'react-redux'
import { useDrag } from 'react-dnd'
import { Text, PseudoBox, Icon, Box, Flex, useToast } from '@chakra-ui/core'
import ActionButton from '../inspector/ActionButton'
import useDispatch from '../../hooks/useDispatch'
import { getAllTheComponents } from '../../core/selectors/components'

const DragItem: React.FC<ComponentItemProps> = ({
  type,
  soon,
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
  const allComponents = useSelector(getAllTheComponents)

  let boxProps: any = {
    cursor: 'no-drop',
    color: 'whiteAlpha.600',
  }

  if (!soon) {
    boxProps = {
      ref: drag,
      color: 'whiteAlpha.800',
      cursor: 'move',
      _hover: {
        ml: -1,
        mr: 1,
        bg: 'teal.100',
        shadow: 'sm',
        color: 'teal.800',
      },
    }
  }

  if (isChild) {
    boxProps = { ...boxProps, ml: 4 }
  }

  //Check if there is a instance of the custom component in all the pages.
  const isInstancePresent = () => {
    let instanceFound = false
    Object.values(allComponents).forEach(components => {
      if (
        Object.values(components).findIndex(
          component => component.type === type,
        ) !== -1
      ) {
        instanceFound = true
        return
      }
    })
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
      <PseudoBox
        boxSizing="border-box"
        transition="margin 200ms"
        rounded="md"
        display="flex"
        alignItems="center"
        {...boxProps}
        width="95%"
        p={1}
      >
        <Icon fontSize="xs" mr={2} name="drag-handle" />

        <Text letterSpacing="wide" fontSize="sm" textTransform="capitalize">
          {label}
        </Text>

        {isMeta && (
          <Box
            ml={2}
            borderWidth="1px"
            color="teal.300"
            borderColor="teal.600"
            fontSize="xs"
            rounded={4}
            px={1}
          >
            preset
          </Box>
        )}

        {soon && (
          <Box
            ml={2}
            borderWidth="1px"
            color="whiteAlpha.500"
            borderColor="whiteAlpha.300"
            fontSize="xs"
            rounded={4}
            px={1}
          >
            soon
          </Box>
        )}
      </PseudoBox>

      {custom && (
        <ActionButton
          label="Delete component"
          icon="delete"
          onClick={() => deleteComponentHandler(type)}
        />
      )}
    </Flex>
  )
}

export default DragItem
