import React, { memo, useState } from 'react'
import { Select, Input, Button, Flex, useToast } from '@chakra-ui/core'
import { useSelector } from 'react-redux'

import FormControl from '../../controls/FormControl'
import { useForm } from '../../../../hooks/useForm'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import useDispatch from '../../../../hooks/useDispatch'
import {
  getSelectedComponentId,
  getPropsBy,
  getShowCustomComponentPage,
  getChildrenBy,
} from '../../../../core/selectors/components'

const FlexPanel = () => {
  const { setValueFromEvent } = useForm()

  const alignItems = usePropsSelector('alignItems')
  const flexDirection = usePropsSelector('flexDirection')
  const justifyContent = usePropsSelector('justifyContent')

  const dispatch = useDispatch()
  const id = useSelector(getSelectedComponentId)
  const props = useSelector(getPropsBy(id))
  const childrenProp = props.find(prop => prop.name === 'children')
  const [name, setName] = useState('')
  const isCustomComponentPage = useSelector(getShowCustomComponentPage)
  const children = useSelector(getChildrenBy(id))
  const toast = useToast()

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
    <>
      <FormControl label="Direction">
        <Select
          name="flexDirection"
          size="sm"
          value={flexDirection}
          onChange={setValueFromEvent}
        >
          <option>row</option>
          <option>row-reverse</option>
          <option>column</option>
          <option>column-reverse</option>
        </Select>
      </FormControl>

      <FormControl label="Justify content">
        <Select
          name="justifyContent"
          size="sm"
          value={justifyContent}
          onChange={setValueFromEvent}
        >
          <option>flex-start</option>
          <option>center</option>
          <option>flex-end</option>
          <option>space-between</option>
          <option>space-around</option>
        </Select>
      </FormControl>

      <FormControl label="Align items">
        <Select
          name="alignItems"
          size="sm"
          value={alignItems || ''}
          onChange={setValueFromEvent}
        >
          <option>stretch</option>
          <option>flex-start</option>
          <option>center</option>
          <option>flex-end</option>
          <option>space-between</option>
          <option>space-around</option>
        </Select>
      </FormControl>
      {isCustomComponentPage ? (
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
    </>
  )
}

export default memo(FlexPanel)
