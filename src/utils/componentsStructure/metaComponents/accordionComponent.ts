const AccordionComponent = {
  Accordion: `
  <Accordion defaultIndex={[0]}>
  <AccordionItem>
      <AccordionButton>
        <Text flex="1" textAlign="left">
          Click here to open Accordion
        </Text>
        <AccordionIcon />
      </AccordionButton>
    <AccordionPanel>
    <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
      </Text>
    </AccordionPanel>
  </AccordionItem>
</Accordion>
  `,
  AccordionIcon: `<AccordionIcon />`,
  AccordionButton: ` <AccordionButton>
  <Text flex="1" textAlign="left">
    Click here to open Accordion
  </Text>
  <AccordionIcon />
</AccordionButton>`,
  AccordionItem: `<AccordionItem>
  <AccordionButton>
    <Text flex="1" textAlign="left">
      Click here to open Accordion
    </Text>
    <AccordionIcon />
  </AccordionButton>
<AccordionPanel>
<Text>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
  commodo consequat.
  </Text>
</AccordionPanel>
</AccordionItem>`,
  AccordionPanel: `<AccordionPanel>
  <Text>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat.
    </Text>
  </AccordionPanel>`,
}

export default AccordionComponent
