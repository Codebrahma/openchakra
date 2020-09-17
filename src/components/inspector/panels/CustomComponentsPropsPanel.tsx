import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Accordion } from '@chakra-ui/core'
import {
  getSelectedComponentId,
  getPropsBy,
} from '../../../core/selectors/components'
import CustomComponentsPropsControl from '../controls/customComponentsPropsControl'
import ParentInspector from '../ParentInspector'
import AccordionContainer from '../AccordionContainer'
import ChildrenInspector from '../ChildrenInspector'

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
      <Accordion defaultIndex={[0]}>
        <AccordionContainer title="Parent">
          <ParentInspector />
        </AccordionContainer>
        <AccordionContainer title="Children">
          <ChildrenInspector />
        </AccordionContainer>
      </Accordion>
    </>
  )
}

export default CustomComponentsPropsPanel
