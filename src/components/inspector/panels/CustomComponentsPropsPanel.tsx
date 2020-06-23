import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@chakra-ui/core'
import { getSelectedComponent } from '../../../core/selectors/components'
import ExposedPropsPanel from './ExposedPropsPanel'

const CustomComponentsPropsPanel = () => {
  const selectedComponent = useSelector(getSelectedComponent)

  return (
    <>
      {Object.keys(selectedComponent.props).map(prop => (
        <Box key={prop} m="10px">
          <ExposedPropsPanel propName={prop} />
        </Box>
      ))}
    </>
  )
}

export default CustomComponentsPropsPanel
