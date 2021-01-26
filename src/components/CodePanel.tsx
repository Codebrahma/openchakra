import React, { memo } from 'react'
import {
  Box,
  Button,
  Tabs,
  TabPanels,
  TabList,
  Tab,
  TabPanel,
  IconButton,
} from '@chakra-ui/core'
import { AddIcon } from '@chakra-ui/icons'
import { useSelector } from 'react-redux'
import { getCodeState } from '../core/selectors/code'
import { ControlledEditor } from '@monaco-editor/react'
import babelQueries from '../babel-queries/queries'
import useDispatch from '../hooks/useDispatch'
import { generateComponentId } from '../utils/generateId'
import { getSelectedPage } from '../core/selectors/page'
import formatCode from '../utils//codeGeneration/formatCode'

const SaveButton = ({
  children,
  onClick,
}: {
  children: any
  onClick: () => void
}) => {
  return (
    <Button
      onClick={onClick}
      size="sm"
      position="absolute"
      textTransform="uppercase"
      fontSize="xs"
      height="30px"
      top={20}
      right="2.25em"
      zIndex={100}
      bg="#8888FC"
      color="white"
      _hover={{ bg: '#4D3DF7' }}
    >
      {children}
    </Button>
  )
}

const MonacoEditor = ({
  value,
  onChange,
}: {
  value: string
  onChange: (event: any, value: string | undefined) => void
}) => {
  return (
    <ControlledEditor
      height="100%"
      language="javascript"
      theme="dark"
      options={{
        minimap: {
          enabled: false,
        },
        scrollbar: {
          vertical: 'hidden',
        },
      }}
      value={value}
      onChange={onChange}
    />
  )
}

const CodePanel = () => {
  const dispatch = useDispatch()

  const selectedPage = useSelector(getSelectedPage)
  const codeState = useSelector(getCodeState)

  const { componentsCode, pagesCode } = codeState

  const generateProperCode = (code: string) => {
    const codeWithOutComponentId = babelQueries.removeComponentId(code)

    // Remove the isContainerComponent prop if it is added for any custom component.
    const properCode = babelQueries.removePropInAllComponents(
      codeWithOutComponentId,
      {
        propName: 'isContainerComponent',
      },
    )

    return formatCode(properCode)
  }

  const savePageCodeHandler = (pageName: string, codeValue: string) => {
    const transformedCode = babelQueries.setIdToComponents(codeValue)
    const componentsState = babelQueries.getComponentsState(transformedCode)
    dispatch.code.setPageCode(transformedCode, pageName)
    dispatch.components.resetComponentsState(componentsState)
  }

  const saveComponentsCodeHandler = (
    componentName: string,
    codeValue: string,
  ) => {
    const transformedCode = babelQueries.setIdToComponents(codeValue)
    const componentsState = babelQueries.getComponentsState(transformedCode)
    dispatch.code.setComponentsCode(transformedCode, componentName)
    dispatch.components.updateCustomComponentsState(componentsState)
  }

  const createNewFileHandler = () => {
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
      const componentsState = babelQueries.getComponentsState(
        customComponentCode,
      )
      dispatch.components.updateCustomComponentsState(componentsState)
    }
  }

  return (
    <Box
      fontSize="sm"
      backgroundColor="white"
      overflow="auto"
      height="100%"
      position="relative"
      maxWidth="83vw"
    >
      <Tabs variant="enclosed">
        <TabList>
          <Tab>{selectedPage}.js</Tab>
          {Object.keys(componentsCode).map(componentName => (
            <Tab key={componentName}>{componentName + '.js'}</Tab>
          ))}
          <IconButton
            aria-label="Search database"
            icon={<AddIcon />}
            backgroundColor="white"
            onClick={createNewFileHandler}
          />
        </TabList>
        <TabPanels height="90vh">
          <TabPanel height="100%" p={0}>
            <MonacoEditor
              value={generateProperCode(pagesCode[selectedPage])}
              onChange={(_, value) => {
                pagesCode[selectedPage] = value || ''
              }}
            />
            <SaveButton
              onClick={() =>
                savePageCodeHandler(selectedPage, pagesCode[selectedPage])
              }
            >
              Save Code
            </SaveButton>
          </TabPanel>
          {Object.keys(componentsCode).map(componentName => {
            return (
              <TabPanel height="100%" p={0} key={componentName}>
                <MonacoEditor
                  value={generateProperCode(componentsCode[componentName])}
                  onChange={(_, value) => {
                    componentsCode[componentName] = value || ''
                  }}
                />
                <SaveButton
                  onClick={() =>
                    saveComponentsCodeHandler(
                      componentName,
                      componentsCode[componentName],
                    )
                  }
                >
                  Save Code
                </SaveButton>
              </TabPanel>
            )
          })}
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default memo(CodePanel)
