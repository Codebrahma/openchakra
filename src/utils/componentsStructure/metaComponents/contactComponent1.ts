const Contact1 = `
<Flex p="10">
<Box width="50%" p="10">
  <Box mb="20" maxWidth="400px">

    <Text fontSize="sm" fontWeight="700" color="gray.500">
      Contact Us
    </Text>
    <Heading fontSize="4xl">We will be glad to hear from you!</Heading>
  </Box>
  <Box>

    <Box mb="10">
      <Text fontSize="sm" fontWeight="700" color="gray.500">Phone</Text>
      <Text>+1 484 506 0634</Text>
    </Box><Box mb="10">
      <Text fontSize="sm" fontWeight="700" color="gray.500">
        Address
      </Text>
      <Text>156 2nd Street,</Text>

      <Text>San Francisco</Text>
    </Box><Box mb="10">
      <Text fontSize="sm" fontWeight="700" color="gray.500">
        E-mail
      </Text>
      <Text>hello@codebrahma.com</Text>
    </Box>
  </Box>
</Box>
<Box
  width="50%"
  display="flex"
  flexDirection="column"
  justifyContent="center"
>
  <Box display="flex" justifyContent="flex-start" mb="5">
    <Text fontWeight="700" mr="5">Department</Text>

    <RadioGroup>
      <Radio mr="5" isChecked="true">Sales</Radio>
      <Radio>Support</Radio>
    </RadioGroup>
  </Box>
  <Input
    backgroundColor="#f8fafc"
    placeholder="Subject"
    fontWeight="700"
    fontSize="sm"
    mb="5"
    width="560px"
  />
  <Input
    backgroundColor="#f8fafc"
    placeholder="name@example.com"
    fontWeight="700"
    fontSize="sm"
    mb="5"
    width="560px"
  />
  <Input
    backgroundColor="#f8fafc"
    placeholder="name"
    fontWeight="700"
    fontSize="sm"
    mb="5"
    width="560px"
  />
  <Textarea
    backgroundColor="#f8fafc"
    height="32"
    placeholder="message..."
    fontSize="sm"
    width="560px"
  />
  <Flex
    justifyContent="space-between"
    mt="6"
    alignItems="center"
    width="560px"
  >
    <Flex>
      <Checkbox>I agree to terms and conditions.</Checkbox>
    </Flex>
    <Button colorScheme="primary" width="24" height="12">Submit</Button>
  </Flex>
</Box>
</Flex>`

export default Contact1
