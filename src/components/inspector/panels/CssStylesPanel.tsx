import React, { useState } from 'react'
import { Box, Textarea, Button } from '@chakra-ui/core'
import cssToObject from 'css-to-object'
import { useSelector } from 'react-redux'

import useDispatch from '../../../hooks/useDispatch'
import { getCode } from '../../../core/selectors/code'
import babelQueries from '../../../babel-queries/queries'
import {
  getSelectedComponentId,
  getSelectedPage,
} from '../../../core/selectors/components'

const CssStylesPanel = () => {
  const [textareaValue, setTextareaValue] = useState('')
  const dispatch = useDispatch()
  const code = useSelector(getCode)
  const componentId = useSelector(getSelectedComponentId)
  const selectedPage = useSelector(getSelectedPage)

  const changeHandler = (e: any) => {
    setTextareaValue(e.target.value)
  }
  const addStylesHandler = () => {
    const stylesObject = cssToObject(textareaValue)

    const updatedCode = babelQueries.addProps(code, {
      componentId,
      propsToBeAdded: stylesObject,
    })
    const componentsState = babelQueries.getComponentsState(updatedCode)
    dispatch.code.setPageCode(updatedCode, selectedPage)
    dispatch.components.updateComponentsState(componentsState)

    setTextareaValue('')
  }

  return (
    <Box>
      <Textarea
        onChange={changeHandler}
        fontSize="12px"
        height="8rem"
        value={textareaValue}
      />
      <Button
        onClick={addStylesHandler}
        disabled={textareaValue.length === 0 ? true : false}
        height="35px"
        fontSize="xs"
        bg="white"
        color="primary.500"
        border="1px solid #5D55FA"
        display="block"
        margin="0 auto"
        mt={2}
        mb={2}
      >
        Add Styles
      </Button>
    </Box>
  )
}

export default CssStylesPanel
