import React, { useState } from 'react'
import { Box, Textarea, Button } from '@chakra-ui/core'
import cssToObject from 'css-to-object'

import useDispatch from '../../../hooks/useDispatch'

const CssStylesPanel = () => {
  const [textareaValue, setTextareaValue] = useState('')
  const dispatch = useDispatch()

  const changeHandler = (e: any) => {
    setTextareaValue(e.target.value)
  }
  const addStylesHandler = () => {
    const stylesObject = cssToObject(textareaValue)
    dispatch.components.addProps(stylesObject)
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
