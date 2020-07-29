import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@chakra-ui/core'
import {
  getSelectedComponentId,
  getPropsBy,
} from '../../../core/selectors/components'
import CustomComponentsPropsControl from '../controls/customComponentsPropsControl'

const CustomComponentsPropsPanel = () => {
  const selectedId = useSelector(getSelectedComponentId)
  const props = useSelector(getPropsBy(selectedId))

  return (
    <>
      {props.map(prop => (
        <Box key={prop.id} m="10px">
          <CustomComponentsPropsControl propName={prop.name} />
        </Box>
      ))}
    </>
  )
}

export default CustomComponentsPropsPanel
