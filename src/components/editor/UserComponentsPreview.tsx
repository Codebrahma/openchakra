import React, { useEffect } from 'react'
import { Box, Text, Flex, Button, Heading, useToast } from '@chakra-ui/core'
import {
  getCustomComponentsList,
  getCustomComponents,
} from '../../core/selectors/components'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { generateComponentId } from '../../utils/generateId'
import useDispatch from '../../hooks/useDispatch'
import babelQueries from '../../babel-queries/queries'
import { DeleteIcon } from '@chakra-ui/icons'
import ActionButton from '../actionButtons/ActionButton'
import isContainsOnlyAlphaNumeric from '../../utils/isContainsOnlyAlphaNumeric'
import { getPageCode } from '../../core/selectors/code'

const UserComponentsPreview: React.FC = () => {
  const customComponentsList = useSelector(getCustomComponentsList)
  const AppPageCode = useSelector(getPageCode('app'))
  const appPageComponents = babelQueries.generateComponentsState(AppPageCode)
    .components
  const customComponents = useSelector(getCustomComponents)
  const dispatch = useDispatch()
  const history = useHistory()
  const toast = useToast()

  useEffect(() => {
    dispatch.components.resetComponents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createNewComponent = () => {
    const componentName: string =
      window.prompt('Enter the custom component name') || ''
    const componentId = generateComponentId()

    if (componentName.length > 1) {
      if (!isContainsOnlyAlphaNumeric(componentName)) {
        toast({
          title: 'Invalid name format',
          description: 'The component name can have letters and numbers only.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
        return
      }
      // First letter should be caps.
      const properComponentName =
        componentName.charAt(0).toUpperCase() + componentName.slice(1)

      const customComponentCode = `
      import React from 'react';
      import {Box} from '@chakra-ui/core'
  
      const ${properComponentName} =()=>{
        return (
          <Box compId='${componentId}'></Box>
        )
      }
      export default ${properComponentName}
      `
      dispatch.code.setComponentsCode(customComponentCode, properComponentName)
      const componentsState = babelQueries.generateComponentsState(
        customComponentCode,
      )
      dispatch.components.updateCustomComponentsState(componentsState)
      history.push(`/customPage/component?name=${properComponentName}`)
    }
  }

  //Check if there is a instance of the custom component in all the pages.
  const isInstancePresent = (type: string) => {
    let instanceFound: boolean = false
    console.log(appPageComponents)
    if (
      Object.values(appPageComponents).findIndex(
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
    if (isInstancePresent(componentType))
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
      dispatch.code.removeComponentCode(componentType)
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
    <Flex flexDirection="column" alignItems="center">
      <Heading fontSize="xl" mt={5}>
        User Components Section
      </Heading>
      {customComponentsList.length > 0 ? (
        <Box width="90%">
          <Heading fontSize="xl" mt={5}>
            Your components :{' '}
          </Heading>
          <Flex flexWrap="wrap">
            {customComponentsList.map(customComponent => {
              const linkName = `/customPage/component?name=${customComponent}`
              return (
                <Link
                  to={linkName}
                  style={{ width: '30%' }}
                  key={customComponent}
                >
                  <Flex
                    justifyContent="space-between"
                    p={5}
                    boxShadow="0 1px 6px 1px rgba(0,0,0,0.1)"
                    m={5}
                    cursor="pointer"
                    _hover={{ boxShadow: '0 1px 6px 1px #8888FC' }}
                  >
                    <Text fontWeight={700} fontSize="md">
                      {customComponent}
                    </Text>
                    <ActionButton
                      label="Delete component"
                      size="xl"
                      icon={<DeleteIcon />}
                      onClick={(e: any) => {
                        e.stopPropagation()
                        e.preventDefault()
                        deleteComponentHandler(customComponent)
                      }}
                    />
                  </Flex>
                </Link>
              )
            })}
          </Flex>
        </Box>
      ) : (
        <Box
          mt={10}
          fontSize="2xl"
          fontWeight={600}
          textAlign="center"
          maxWidth="70%"
        >
          <Text>Oops! You had not created any components yet.</Text>
          <Text> Start creating one now.</Text>
        </Box>
      )}

      <Box mt={10}>
        <Button
          m={5}
          onClick={createNewComponent}
          bg="white"
          color="primary.500"
          border="1px solid #5D55FA"
        >
          Create New Component
        </Button>
      </Box>
    </Flex>
  )
}

export default UserComponentsPreview
