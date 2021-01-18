import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Accordion } from '@chakra-ui/core'
import { getPropsOfSelectedComp } from '../../../core/selectors/components'
import CustomComponentsPropsControl from '../controls/customComponentsPropsControl'
import ParentInspector from '../ParentInspector'
import AccordionContainer from '../AccordionContainer'
import ChildrenInspector from '../ChildrenInspector'
import ContainerComponentControl from '../controls/ContainerComponentControl'
import { checkIsCustomPage } from '../../../core/selectors/page'

const CustomComponentsPropsPanel = () => {
  const props = useSelector(getPropsOfSelectedComp).filter(
    prop => prop.name !== 'children',
  )
  const isCustomPage = useSelector(checkIsCustomPage)

  return (
    <>
      {props.map(prop => (
        <Box key={prop.id} m="10px">
          <CustomComponentsPropsControl propName={prop.name} />
        </Box>
      ))}

      <Accordion defaultIndex={[0, 1]}>
        <AccordionContainer title="Parent">
          <ParentInspector />
        </AccordionContainer>
        {isCustomPage && (
          <AccordionContainer title="Children">
            <ChildrenInspector />
          </AccordionContainer>
        )}
      </Accordion>
      {isCustomPage ? <ContainerComponentControl /> : null}
    </>
  )
}

export default CustomComponentsPropsPanel
