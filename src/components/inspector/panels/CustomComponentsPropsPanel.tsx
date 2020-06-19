import React from 'react'
import { useSelector } from 'react-redux'
import { Input, Box, Flex } from '@chakra-ui/core'
import FormControl from '../controls/FormControl'
import { useForm } from '../../../hooks/useForm'
import {
  getSelectedComponent,
  getShowCustomComponentPage,
} from '../../../core/selectors/components'
import useDispatch from '../../../hooks/useDispatch'
import ActionButton from '../ActionButton'

const CustomComponentsPropsPanel = () => {
  const { setValueFromEvent } = useForm()
  const selectedComponent = useSelector(getSelectedComponent)
  const dispatch = useDispatch()
  const isCustomComponentPage = useSelector(getShowCustomComponentPage)

  return (
    <>
      {Object.keys(selectedComponent.props).map(prop => (
        <Box key={prop} m="10px">
          <FormControl label={prop} htmlFor={prop}>
            <Flex alignItems="center">
              <Input
                value={selectedComponent.props[prop]}
                size="sm"
                name={prop}
                onChange={setValueFromEvent}
              />
              {isCustomComponentPage ? (
                <ActionButton
                  label="delete Exposed prop"
                  icon="small-close"
                  onClick={() => dispatch.components.deleteExposedProp(prop)}
                />
              ) : null}
            </Flex>
          </FormControl>
        </Box>
      ))}
    </>
  )
}

export default CustomComponentsPropsPanel
