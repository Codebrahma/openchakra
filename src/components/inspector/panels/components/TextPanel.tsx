import React from 'react'
import ChildrenControl from '../../controls/ChildrenControl'
import { Button } from '@chakra-ui/core'
import { useSelector } from 'react-redux'

import { getSelectedIndex } from '../../../../core/selectors/app'
import useDispatch from '../../../../hooks/useDispatch'

const TextPanel = () => {
  const selectedTextIndex = useSelector(getSelectedIndex)
  const { start, end } = selectedTextIndex
  const dispatch = useDispatch()

  const enableSpanConversion = start !== -1 && end !== -1
  const clickHandler = () => {
    dispatch.components.addSpanComponent({
      start,
      end,
    })
  }

  return (
    <>
      <ChildrenControl />
      <Button isDisabled={!enableSpanConversion} onClick={clickHandler}>
        Convert to span
      </Button>
    </>
  )
}

export default TextPanel
