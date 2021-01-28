import React from 'react'
import { Box, Text, Flex, Button, Heading } from '@chakra-ui/core'
import { getCustomComponentsList } from '../../core/selectors/components'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { generateComponentId } from '../../utils/generateId'
import useDispatch from '../../hooks/useDispatch'
import babelQueries from '../../babel-queries/queries'

const UserComponentsPreview: React.FC = () => {
  const customComponentsList = useSelector(getCustomComponentsList)
  const dispatch = useDispatch()
  const history = useHistory()

  const createNewComponent = () => {
    const customComponentName: string =
      window.prompt('Enter the custom component name') || ''
    const componentId = generateComponentId()

    if (customComponentName.length > 1) {
      // First letter should be caps.
      let properComponentName = customComponentName.split(' ').join('')
      properComponentName =
        properComponentName.charAt(0).toUpperCase() +
        properComponentName.slice(1)

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
      dispatch.code.setComponentsCode(customComponentCode, customComponentName)
      const componentsState = babelQueries.generateComponentsState(
        customComponentCode,
      )
      dispatch.components.updateCustomComponentsState(componentsState)
      history.push(`/customPage/component?name=${customComponentName}`)
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
                <Link to={linkName} style={{ width: '30%' }}>
                  <Box
                    p={5}
                    boxShadow="0 1px 6px 1px rgba(0,0,0,0.1)"
                    m={5}
                    cursor="pointer"
                    _hover={{ bg: 'primary.100' }}
                    textAlign="center"
                  >
                    <Text fontWeight={700} fontSize="md">
                      {customComponent}
                    </Text>
                  </Box>
                </Link>
              )
            })}
          </Flex>
        </Box>
      ) : (
        <Text
          mt={10}
          fontSize="2xl"
          fontWeight={600}
          textAlign="center"
          maxWidth="70%"
        >
          Oops! You don't have any components. You can create one now or you can
          browse from already created components.
        </Text>
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
