import React, { memo, useState, FormEvent, ChangeEvent, useRef } from 'react'
import { useInspectorState } from '../../../contexts/inspector-context'
import {
  getSelectedComponent,
  getPropsOfSelectedComp,
  getSelectedPage,
} from '../../../core/selectors/components'
import { useSelector } from 'react-redux'
import { IoIosFlash } from 'react-icons/io'
import {
  IconButton,
  Flex,
  Box,
  SimpleGrid,
  InputGroup,
  InputRightElement,
  Input,
  ButtonGroup,
} from '@chakra-ui/core'
import { SmallCloseIcon, EditIcon } from '@chakra-ui/icons'

import useDispatch from '../../../hooks/useDispatch'
import { useForm } from '../../../hooks/useForm'
import babelQueries from '../../../babel-queries/queries'
import { getCode } from '../../../core/selectors/code'

const SEPARATOR = '='

const AdditionalPropsPanel = () => {
  const dispatch = useDispatch()
  const inputRef = useRef<HTMLInputElement>(null)

  const activePropsRef = useInspectorState()
  const { id } = useSelector(getSelectedComponent)
  const props = useSelector(getPropsOfSelectedComp)
  const code = useSelector(getCode)
  const selectedPage = useSelector(getSelectedPage)

  const { setValue } = useForm()
  const [quickProps, setQuickProps] = useState('')
  const [hasError, setError] = useState(false)

  // Yet to do for custom components code
  const onDelete = (propsName: string) => {
    const prop = props.find(prop => prop.name === propsName) || undefined

    if (prop) {
      dispatch.components.deleteProps({
        componentId: id,
        propId: prop.id,
      })

      const updatedCode = babelQueries.deleteProp(code, {
        componentId: id,
        propName: prop.name,
      })
      dispatch.code.setPageCode(updatedCode, selectedPage)
    }
  }

  const submitHandler = (event: FormEvent) => {
    event.preventDefault()

    const index = quickProps.indexOf('=')
    const name = quickProps.slice(0, index)
    const value = quickProps.slice(index + 1)

    if (name && value) {
      const id = props.find(prop => prop.name === name)?.id

      setValue(id || name, name, value)
      setQuickProps('')
      setError(false)
    } else {
      setError(true)
    }
  }

  const activeProps = activePropsRef || []
  const customProps = props.filter(prop => !activeProps.includes(prop.name))
  return (
    <>
      <form onSubmit={submitHandler}>
        <InputGroup mb={3} size="sm">
          <InputRightElement
            children={<Box as={IoIosFlash} color="gray.300" />}
          />
          <Input
            ref={inputRef}
            isInvalid={hasError}
            value={quickProps}
            placeholder={`props${SEPARATOR}value`}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setQuickProps(event.target.value)
            }
          />
        </InputGroup>
      </form>

      {customProps.map((prop, i) => {
        return (
          <Flex
            key={prop.name}
            alignItems="center"
            px={2}
            bg={i % 2 === 0 ? 'white' : 'gray.50'}
            fontSize="xs"
            justifyContent="space-between"
          >
            <SimpleGrid width="100%" columns={2} spacing={1}>
              <Box fontWeight="bold">{prop.name}</Box>
              <Box>{prop.value}</Box>
            </SimpleGrid>

            <ButtonGroup display="flex" size="xs" isAttached>
              <IconButton
                onClick={() => {
                  setQuickProps(`${prop.name}=${prop.value}`)
                  if (inputRef.current) {
                    inputRef.current.focus()
                  }
                }}
                variant="ghost"
                size="xs"
                aria-label="edit"
                icon={<EditIcon />}
              />
              <IconButton
                onClick={() => onDelete(prop.name)}
                variant="ghost"
                size="xs"
                aria-label="delete"
                icon={<SmallCloseIcon />}
              />
            </ButtonGroup>
          </Flex>
        )
      })}
    </>
  )
}

export default memo(AdditionalPropsPanel)
