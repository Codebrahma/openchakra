// The order of builder and default components structure should be same.
// When you add a meta component, the default component structure and also the builder file should be updated.

const componentsStructure: any = {
  Box: `<Box></Box>`,
  Text: `<Text>Text value</Text>`,
  Button: `<Button>Button Text</Button>`,
  Heading: `<Heading>Heading Text</Heading>`,
  Badge: `<Badge>Badge</Badge>`,
  Avatar: `<Avatar />`,
  AvatarGroup: `<AvatarGroup spacing={-3} max={3} size="md"></AvatarGroup>`,
  Checkbox: `<Checkbox>Label checkbox</Checkbox>`,
  Flex: `<Flex></Flex>`,
  AspectRatio: `AspectRatio`,
  Grid: `<Grid templateColumns="repeat(5, 1fr)" gap={6} ></Grid>`,
  Icon: `<Icon as={CopyIcon} />`,
  IconButton: `<IconButton aria-label="icon" />`,
  CircularProgress: `<CircularProgress value={50} size="48px" />`,
  CloseButton: `<CloseButton />`,
  Code: `<Code>Code value</Code>`,
  Divider: `<Divider borderColor="blackAlpha.500" />`,
  Link: `<Link>Link text</Link>`,
  Input: `<Input />`,
  Image: `<Image height="100px" width="100px" />`,
  Progress: `<Progress value={50} />`,
  Radio: `<Radio>Radio</Radio>`,
  RadioGroup: `<RadioGroup></RadioGroup>`,
  SimpleGrid: `<SimpleGrid columns={2} spacingX={1} spacingY={1}></SimpleGrid>`,
  Spinner: `<Spinner />`,
  Select: `<Select />`,
  Stack: `<Stack></Stack>`,
  Switch: `<Switch />`,
  Tag: `<Tag>Tag name</Tag>`,
  TextArea: `<Textarea />`,
  AlertMeta: `<Alert>
    <AlertIcon height={8} />
    <AlertTitle mr={1}>Alert title</AlertTitle>
    <AlertDescription>Alert description</AlertDescription>
  </Alert>`,
  AccordionMeta: ` <Accordion>
  <AccordionItem>
    <AccordionButton>
      <Text>Text value</Text>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel>
      <Box />
    </AccordionPanel>
  </AccordionItem>
</Accordion>`,
  BreadcrumbMeta: `<Breadcrumb>
<BreadcrumbItem>
  <BreadcrumbLink>Lorem Ipsum</BreadcrumbLink>
</BreadcrumbItem>
<BreadcrumbItem>
  <BreadcrumbLink>Lorem Ipsum</BreadcrumbLink>
</BreadcrumbItem>
</Breadcrumb>`,
  FormControlMeta: `<FormControl>
<FormLabel>Label</FormLabel>
<Input />
<FormHelperText>Helper message</FormHelperText>
<FormErrorMessage>Error message</FormErrorMessage>
</FormControl>`,
  MenuMeta: `<Menu isOpen>
<MenuButton>
  <Button>Button text</Button>
</MenuButton>
<MenuList>
  <MenuItem>
    <Text>Text value</Text>
  </MenuItem>
  <MenuItem>
    <Text>Text value</Text>
  </MenuItem>
</MenuList>
</Menu>`,
  ListMeta: ` <List>
<ListItem>list</ListItem>
</List>`,
  NumberInputMeta: `<NumberInput>
<NumberInputField />
<NumberInputStepper>
  <NumberIncrementStepper />
  <NumberDecrementStepper />
</NumberInputStepper>
</NumberInput>`,
  InputGroupMeta: `  <InputGroup>
<InputLeftAddon>left</InputLeftAddon>
<Input />
<InputRightElement>
  <Icon as={CopyIcon} />
</InputRightElement>
</InputGroup>`,
}

export default componentsStructure
