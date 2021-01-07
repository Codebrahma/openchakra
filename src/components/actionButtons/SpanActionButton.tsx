import React from 'react'
import { useSelector } from 'react-redux'
import { IoMdBrush } from 'react-icons/io'
import { useToast } from '@chakra-ui/core'

import useDispatch from '../../hooks/useDispatch'
import ActionButton from './ActionButton'
import {
  getIsContainsOnlySpan,
  getSelectedTextDetails,
  getIsSelectionEnabled,
} from '../../core/selectors/text'
import { isSelectedRangeContainsTwoSpan } from '../../core/selectors/components'

const SpanActionButton = () => {
  const toast = useToast()
  const dispatch = useDispatch()
  const containsOnlySpan = useSelector(getIsContainsOnlySpan)
  const selectedTextDetails = useSelector(getSelectedTextDetails)

  const isSelectedTwoSpan = useSelector(
    isSelectedRangeContainsTwoSpan({
      start: selectedTextDetails.startNodePosition,
      end: selectedTextDetails.endNodePosition,
    }),
  )
  const isSelectionEnabled = useSelector(getIsSelectionEnabled)

  const clickHandler = () => {
    if (isSelectedTwoSpan) {
      toast({
        title: 'Multiple span components',
        description: 'Multiple span components are selected.',
        status: 'error',
        duration: 1000,
        isClosable: true,
        position: 'top',
      })
    } else {
      if (containsOnlySpan) {
        dispatch.components.removeSpan(selectedTextDetails)
      } else {
        dispatch.components.addSpan(selectedTextDetails)
      }
      dispatch.text.removeSelection()
    }
  }
  return (
    <ActionButton
      label={containsOnlySpan ? 'Remove Span' : 'Wrap with Span'}
      onClick={clickHandler}
      icon={<IoMdBrush />}
      color={containsOnlySpan ? 'primary.800' : 'black'}
      bg={containsOnlySpan ? 'primary.100' : 'white'}
      isDisabled={!isSelectionEnabled}
    />
  )
}

export default SpanActionButton
