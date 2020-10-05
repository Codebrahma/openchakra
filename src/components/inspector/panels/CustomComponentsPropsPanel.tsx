import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Accordion, Switch, Flex, Text } from '@chakra-ui/core'
import {
  getPropsBy,
  getShowCustomComponentPage,
  getSelectedComponent,
} from '../../../core/selectors/components'
import CustomComponentsPropsControl from '../controls/customComponentsPropsControl'
import ParentInspector from '../ParentInspector'
import AccordionContainer from '../AccordionContainer'
import ChildrenInspector from '../ChildrenInspector'
import useDispatch from '../../../hooks/useDispatch'

const CustomComponentsPropsPanel = () => {
  const selectedComponent = useSelector(getSelectedComponent)
  const selectedId = selectedComponent.id
  const props = useSelector(getPropsBy(selectedId)).filter(
    prop => prop.name !== 'children',
  )
  const isCustomComponentPage = useSelector(getShowCustomComponentPage)
  const dispatch = useDispatch()
  const isChildrenPresent =
    useSelector(getPropsBy(selectedId)).findIndex(
      prop => prop.name === 'children',
    ) !== -1

  const switchChangeHandler = (e: any) => {
    if (e.target.checked) {
      dispatch.components.convertToContainerComponent({
        customComponentType: selectedComponent.type,
      })
    } else {
      dispatch.components.deleteCustomProp('children')
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
