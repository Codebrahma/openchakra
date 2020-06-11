import React from 'react'
import { useSelector } from 'react-redux'
import { Input, Box } from '@chakra-ui/core'
import FormControl from '../controls/FormControl'
import { useForm } from '../../../hooks/useForm'
import { getSelectedComponent } from '../../../core/selectors/components'

const CustomComponentsPropsPanel = () => {
  const { setValueFromEvent } = useForm()
  const selectedComponent = useSelector(getSelectedComponent)

  return (
    <>
      {Object.keys(selectedComponent.props).map(prop => (
        <Box key={prop} m="10px">
          <FormControl label={prop} htmlFor={prop}>
            <Input
              value={selectedComponent.props[prop]}
              size="sm"
              name={prop}
              onChange={setValueFromEvent}
            />
          </FormControl>
        </Box>
      ))}
    </>
  )
}

export default CustomComponentsPropsPanel
