const ECommerce2 = `<Flex m="5" width="85%" height="450px">
<Box width="40%" height="100%">
  <Image
    src="https://dummyimage.com/500x500/f0f3f6/000000"
    width="100%"
    height="100%"
  />

</Box>
<Box width="60%" p="8" height="100%">
  <Text
    fontSize="xs"
    fontWeight="700"
    color="gray.500"
    letterSpacing="widest"
    mb="2"
  >
    BRAND NAME
  </Text>
  <Heading fontSize="3xl" mb="3">The Peter Whiteland</Heading>
  <Flex mb="2">
    <Flex
      pt="2"
      pb="2"
      alignItems="center"
      pr="4"
      borderRightWidth="1px"
      borderColor="#e2e8f0"
    >
      <Flex mr="5">
        <Icon
          as={AiFillStar}
          fontSize="xl"
          color="primary.500"
          mr="1"
        />
        <Icon
          as={AiFillStar}
          fontSize="xl"
          color="primary.500"
          mr="1"
        />
        <Icon
          as={AiFillStar}
          fontSize="xl"
          color="primary.500"
          mr="1"
        />
        <Icon
          as={AiFillStar}
          fontSize="xl"
          color="primary.500"
          mr="1"
        />

        <Icon as={AiOutlineStar} color="primary.500" fontSize="xl" />
      </Flex><Text color="gray.500" fontWeight="700">4 Reviews</Text>
    </Flex>
    <Flex alignItems="center" pl="4">
      <Icon as={FaTwitter} fontSize="lg" color="gray.500" mr="2" />
      <Icon as={FaFacebookF} fontSize="lg" mr="2" color="gray.500" />
      <Icon as={FaComment} fontSize="lg" color="gray.500" />
    </Flex>
  </Flex>
  <Box mb="5">
    <Text color="gray.600" textAlign="justify">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.&nbsp;
    </Text>
  </Box>
  <Flex mb="10">
    <Flex alignItems="center" mr="10">
      <Text mr="4">Color</Text>
      <Flex>
        <Box
          width="6"
          height="6"
          borderRadius="full"
          border="1px"
          borderColor="#e2e8f0"
          backgroundColor="white"
          mr="2"
        />
        <Box
        width="6"
        height="6"
        borderRadius="full"
        border="1px"
        borderColor="#e2e8f0"
        backgroundColor="gray.500"
        mr="2"
        <Box
          width="6"
          height="6"
          borderRadius="full"
          border="1px"
          borderColor="#e2e8f0"
          backgroundColor="primary.500"
        />
       
      </Flex>
    </Flex>
    <Flex alignItems="center">
      <Text mr="4">Size</Text>
      <Button
        border="1px"
        borderColor="#cbd5e0"
        backgroundColor="white"
        rightIcon={<ChevronDownIcon />}
        fontSize="sm"
      >
        SM
      </Button>
    </Flex>
  </Flex>
  <Divider borderColor="#cbd5e0" />
  <Flex mt="4" justifyContent="space-between">
    <Box>
      <Text fontSize="2xl" fontWeight="700">$ 60.00</Text>
    </Box>
    <Box>
      <Button mr="4" colorScheme="primary">Button</Button>
      <IconButton
        aria-label="icon"
        icon={<AiFillHeart />}
        color="gray.400"
        borderRadius="full"
      />
    </Box>
  </Flex>
</Box>
</Flex>`

export default ECommerce2
