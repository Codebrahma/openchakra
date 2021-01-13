import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Accordion, Switch, Flex, Text } from '@chakra-ui/core'
import {
  getShowCustomComponentPage,
  getSelectedComponent,
  getPropsOfSelectedComp,
} from '../../../core/selectors/components'
import CustomComponentsPropsControl from '../controls/customComponentsPropsControl'
import ParentInspector from '../ParentInspector'
import AccordionContainer from '../AccordionContainer'
import ChildrenInspector from '../ChildrenInspector'
import useDispatch from '../../../hooks/useDispatch'
import babelQueries from '../../../babel-queries/queries'
import { getAllPagesCode } from '../../../core/selectors/code'

const CustomComponentsPropsPanel = () => {
  const selectedComponent = useSelector(getSelectedComponent)
  const props = useSelector(getPropsOfSelectedComp).filter(
    prop => prop.name !== 'children',
  )
  const isCustomComponentPage = useSelector(getShowCustomComponentPage)
  const dispatch = useDispatch()
  const isChildrenPresent =
    useSelector(getPropsOfSelectedComp).findIndex(
      prop => prop.name === 'children',
    ) !== -1
  const pagesCode = useSelector(getAllPagesCode)

  const switchChangeHandler = (e: any) => {
    if (e.target.checked) {
      dispatch.components.convertToContainerComponent({
        customComponentType: selectedComponent.type,
      })
      setTimeout(() => {
        const updatedPagesCode = babelQueries.convertInstancesToContainerComp(
          pagesCode,
          { componentName: selectedComponent.type },
        )
        dispatch.code.resetPagesCode(updatedPagesCode)
      })
    } else {
      dispatch.components.deleteCustomProp('children')
      const updatedPagesCode = babelQueries.convertInstancesToNormalComp(
        pagesCode,
        { componentName: selectedComponent.type },
      )
      dispatch.code.resetPagesCode(updatedPagesCode)
    }
  }

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
        {isCustomComponentPage && (
          <AccordionContainer title="Children">
            <ChildrenInspector />
          </AccordionContainer>
        )}
      </Accordion>
      {isCustomComponentPage ? (
        <Flex
          mt={4}
          alignItems="center"
          ml={3}
          justifyContent="space-between"
          mr={3}
        >
          <Text p={0} mr={2} color="gray.500" lineHeight="1rem" fontSize="xs">
            Container component
          </Text>
          <Switch
            isChecked={isChildrenPresent}
            size="sm"
            onChange={switchChangeHandler}
          />
        </Flex>
      ) : null}
    </>
  )
}

export default CustomComponentsPropsPanel
