import React, { memo, useState, FormEvent, ChangeEvent, useRef } from 'react'
import { useInspectorState } from '../../../contexts/inspector-context'
import {
  getSelectedComponent,
  getPropsForSelectedComponent,
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
import useDispatch from '../../../hooks/useDispatch'
import { useForm } from '../../../hooks/useForm'

const SEPARATOR = '='

const AdditionalPropsPanel = () => {
  const dispatch = useDispatch()
  const inputRef = useRef<HTMLInputElement>(null)

  const activePropsRef = useInspectorState()
  const { id } = useSelector(getSelectedComponent)
  const props = useSelector(getPropsForSelectedComponent)
  const { setValue } = useForm()

  const [quickProps, setQuickProps] = useState('')
  const [hasError, setError] = useState(false)

  const onDelete = (propsName: string) => {
    dispatch.components.deleteProps({
      id,
      name: propsName,
    })
  }

  const activeProps = activePropsRef || []
  const customProps = props.filter(prop => !activeProps.includes(prop.name))
  return (
    <>
      <form
        onSubmit={(event: FormEvent) => {
          event.preventDefault()

          const num = quickProps.indexOf('=')
          const name = quickProps.slice(0, num)
          const value = quickProps.slice(num + 1)

          if (name && value) {
            setValue(name, value)
            setQuickProps('')
            setError(false)
          } else {
            setError(true)
          }
        }}
      >
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
                  setQuickProps(`${prop.name}=`)
                  if (inputRef.current) {
                    inputRef.current.focus()
                  }
                }}
                variant="ghost"
                size="xs"
                aria-label="edit"
                icon="edit"
              />
              <IconButton
                onClick={() => onDelete(prop.name)}
                variant="ghost"
                size="xs"
                aria-label="delete"
                icon="small-close"
              />
            </ButtonGroup>
          </Flex>
        )
      })}
    </>
  )
}

export default memo(AdditionalPropsPanel)