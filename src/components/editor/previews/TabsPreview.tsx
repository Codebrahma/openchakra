import React from 'react'
import { useSelector } from 'react-redux'
import { useInteractive } from '../../../hooks/useInteractive'
import { useDropComponent } from '../../../hooks/useDropComponent'
import { Tabs, Tab, TabList, TabPanel, TabPanels, Box } from '@chakra-ui/core'
import ComponentPreview from '../ComponentPreview'
import { TabsWhiteList } from '../../../utils/editor'
import { getShowLayout } from '../../../core/selectors/app'

const TabsPreview: React.FC<IPreviewProps> = ({ component }) => {
  const { props, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, TabsWhiteList)

  if (isOver) {
    props.bg = 'teal.50'
  }

  let boxProps: any = {}

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <Tabs {...props}>
        {component.children.map((key: string) => (
          <ComponentPreview key={key} componentName={key} />
        ))}
      </Tabs>
    </Box>
  )
}

export const TabPreview = ({ component }: IPreviewProps) => {
  const { props, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, TabsWhiteList)

  if (isOver) {
    props.bg = 'teal.50'
  }

  return (
    <Tab ref={drop(ref)} {...props}>
      {component.children.map((key: string) => (
        <ComponentPreview key={key} componentName={key} />
      ))}
    </Tab>
  )
}

export const TabListPreview = ({ component }: IPreviewProps) => {
  const { props, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, TabsWhiteList)

  if (isOver) {
    props.bg = 'teal.50'
  }

  return (
    <TabList ref={drop(ref)} {...props}>
      {component.children.map((key: string) => (
        <ComponentPreview key={key} componentName={key} />
      ))}
    </TabList>
  )
}

export const TabPanelPreview = ({ component }: IPreviewProps) => {
  const { props, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, TabsWhiteList)
  const showLayout = useSelector(getShowLayout)

  if (isOver) {
    props.bg = 'teal.50'
  }

  if (showLayout) {
    props.display = 'block !important'
  }

  return (
    <TabPanel ref={drop(ref)} {...props}>
      {component.children.map((key: string) => (
        <ComponentPreview key={key} componentName={key} />
      ))}
    </TabPanel>
  )
}

export const TabPanelsPreview = ({ component }: IPreviewProps) => {
  const { props, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, TabsWhiteList)

  if (isOver) {
    props.bg = 'teal.50'
  }

  return (
    <TabPanels ref={drop(ref)} {...props}>
      {component.children.map((key: string) => (
        <ComponentPreview key={key} componentName={key} />
      ))}
    </TabPanels>
  )
}

export default TabsPreview
