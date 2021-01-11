/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
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
import {
  isSelectedRangeContainsTwoSpan,
  getSelectedComponentId,
  getPropsBy,
  getProps,
  getSelectedPage,
  getCustomComponents,
} from '../../core/selectors/components'
import { getCode, getAllComponentsCode } from '../../core/selectors/code'
import babelQueries from '../../babel-queries/queries'
import { ISpanComponentsValues } from '../../babel-plugins/set-children-prop-plugin'
import { searchRootCustomComponent } from '../../utils/recursive'

const SpanActionButton = () => {
  const toast = useToast()
  const dispatch = useDispatch()
  const containsOnlySpan = useSelector(getIsContainsOnlySpan)
  const selectedTextDetails = useSelector(getSelectedTextDetails)
  const selectedComponentId = useSelector(getSelectedComponentId)
  const prop = useSelector(getPropsBy(selectedComponentId))
  const props = useSelector(getProps(selectedComponentId))
  const code = useSelector(getCode)
  const selectedPage = useSelector(getSelectedPage)
  const childrenProp = prop.find(prop => prop.name === 'children')
  const customComponents = useSelector(getCustomComponents)
  const isChildOfCustomComponent = customComponents[selectedComponentId]
  const componentsCode = useSelector(getAllComponentsCode)

  const isSelectedTwoSpan = useSelector(
    isSelectedRangeContainsTwoSpan({
      start: selectedTextDetails.startNodePosition,
      end: selectedTextDetails.endNodePosition,
    }),
  )
  const isSelectionEnabled = useSelector(getIsSelectionEnabled)

  useEffect(() => {
    if (childrenProp) {
      const { value } = childrenProp
      if (value.length > 0 && Array.isArray(value)) {
        setTimeout(() => {
          // span component-id will be the key and its children prop value will be the value
          const spanComponentsValues: ISpanComponentsValues = {}
          value.forEach((val: string) => {
            if (props.byComponentId[val]) {
              props.byComponentId[val].forEach(propId => {
                if (props.byId[propId].name === 'children') {
                  spanComponentsValues[val] = props.byId[propId].value
                }
              })
            }
          })

          if (isChildOfCustomComponent) {
            const rootCustomParentElement = searchRootCustomComponent(
              customComponents[selectedComponentId],
              customComponents,
            )
            const updatedCode = babelQueries.setChildrenProp(
              componentsCode[rootCustomParentElement],
              {
                componentId: selectedComponentId,
                value,
                spanComponentsValues,
              },
            )
            dispatch.code.setComponentsCode(
              updatedCode,
              rootCustomParentElement,
            )
          } else {
            const updatedCode = babelQueries.setChildrenProp(code, {
              componentId: selectedComponentId,
              value,
              spanComponentsValues,
            })
            dispatch.code.setPageCode(updatedCode, selectedPage)
          }
        }, 500)
      }
    }
  }, [childrenProp])

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
