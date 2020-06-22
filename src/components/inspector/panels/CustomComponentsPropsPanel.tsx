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
          {/* <FormControl label={prop} htmlFor={prop}>
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
          </FormControl> */}
          <ExposedPropsPanel propName={prop} />
        </Box>
      ))}
    </>
  )
}

export default CustomComponentsPropsPanel
