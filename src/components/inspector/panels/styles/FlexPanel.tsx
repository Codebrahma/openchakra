import React, { memo, useState } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import {
  Box,
  Input,
  Button,
  Flex,
  useToast,
  Switch,
  Text,
} from '@chakra-ui/core'
import useDispatch from '../../../../hooks/useDispatch'
import { useSelector } from 'react-redux'
import {
  getPropsBy,
  getShowCustomComponentPage,
  getChildrenBy,
  getSelectedComponent,
} from '../../../../core/selectors/components'

const FlexPanel = () => {
  const dispatch = useDispatch()
  const toast = useToast()
  const component = useSelector(getSelectedComponent)
  const props = useSelector(getPropsBy(component.id))
  const childrenProp = props.find(prop => prop.name === 'children')
  const [name, setName] = useState('')
  const isCustomComponentPage = useSelector(getShowCustomComponentPage)
  const children = useSelector(getChildrenBy(component.id))
  const isComponentDerivedFromProps = component.parent === 'Prop'
  const isChildrenExposed = childrenProp?.derivedFromPropName ? true : false

  const switchChangeHandler = (e: any) => {
    if (e.target.checked) {
      if (children.length === 0) {
        dispatch.components.exposeProp({
          name: 'children',
          targetedProp: 'children',
        })
      } else {
        toast({
          title: 'Contains Children components',
          description:
            'The children will not exposed if the component already had children components.',
          status: 'error',
          duration: 1000,
          isClosable: true,
          position: 'top',
        })
      }
    } else dispatch.components.unexpose('children')
  }

  const changeHandler = (e: any) => setName(e.target.value)

  const clickHandler = () => {
    if (childrenProp) dispatch.components.unexpose('children')
    else {
      if (children.length === 0 && name.length > 0)
        dispatch.components.exposeProp({ name, targetedProp: 'children' })
      else if (name.length === 0)
        toast({
          title: 'No input given',
          description: 'Please do not leave the input field empty.',
          status: 'error',
          duration: 1000,
          isClosable: true,
          position: 'top',
        })
      else {
        toast({
          title: 'Error while Exposing children',
          description:
            'The component already has children component, so it can not be exposed.',
          status: 'error',
          duration: 1000,
          isClosable: true,
          position: 'top',
        })
      }
    }
  }
  return (
    <Box>
      <ColorsControl
        withFullColor
        label="Color"
        name="backgroundColor"
        enableHues
      />
      {isCustomComponentPage && !isComponentDerivedFromProps ? (
        <Flex flexDirection="column" alignItems="center">
          <Input
            onChange={changeHandler}
            value={name}
            placeholder="expose children as"
            isDisabled={childrenProp ? true : false}
            _disabled={{
              bg: '#EBEBE4',
              cursor: 'not-allowed',
            }}
            onKeyPress={(e: any) => {
              if (e.which === 13) clickHandler()
            }}
            fontSize="sm"
            width="90%"
          />
          <Button
            onClick={clickHandler}
            mt={2}
            mb={2}
            height="35px"
            fontSize="xs"
            bg="white"
            color="primary.500"
            border="1px solid #5D55FA"
          >
            {childrenProp ? 'UnExpose' : 'Expose'}
          </Button>
        </Flex>
      ) : null}
      {isCustomComponentPage ? (
        <Flex mt={4} alignItems="center">
          <Text p={0} mr={2} color="gray.500" lineHeight="1rem" fontSize="xs">
            Use children of Root component
          </Text>
          <Switch
            isChecked={isChildrenExposed}
            size="sm"
            onChange={switchChangeHandler}
          />
        </Flex>
      ) : null}
    </Box>
  )
}

export default memo(FlexPanel)
