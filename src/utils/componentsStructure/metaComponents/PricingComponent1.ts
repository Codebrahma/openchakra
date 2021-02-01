const Pricing1 = ` <Box>
<Box
  display="flex"
  flexDirection="column"
  justifyContent="flex-start"
  alignItems="center"
  mb="4"
>
  <Text fontSize="3xl" fontWeight="600" mb="2">Pricing</Text>
  <Text mb="5">
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium
  </Text>
  <Flex border="2px" borderColor="primary.500" borderRadius="md">
    <Box
      backgroundColor="primary.500"
      color="white"
      pl="5"
      pr="5"
      pt="1"
      pb="1"
      fontWeight="700"
      cursor="pointer"
    >
      <Text>Monthly</Text>
    </Box>
    <Box pl="5" pr="5" pt="1" pb="1" cursor="pointer">
      <Text>Annually</Text>
    </Box>
  </Flex>
</Box>
<Flex p="5">
  <Box
    width="30%"
    p="4"
    border="2px"
    borderColor="gray.300"
    height="400px"
    display="flex"
    flexDirection="column"
    justifyContent="space-between"
    m="5"
    borderRadius="md"
  >
    <Box>
      <Text color="gray.500" letterSpacing="widest">START</Text>
      <Text fontSize="4xl" fontWeight="600" mb="3">Free</Text>
      <Divider borderColor="gray.200" />

    </Box>
    <Box mt="3" mb="3" height="50%">
      <Flex mb="2" alignItems="center">
        <Icon as={CheckCircleIcon} color="green.500" mr="2" />
        <Text color="gray.500">Lorem ipsum dolor sit amet</Text>
      </Flex><Flex mb="2" alignItems="center">
        <Icon as={CheckCircleIcon} color="green.500" mr="2" />
        <Text color="gray.500">
          Sed ut perspiciatis unde omnis&nbsp;
        </Text>
      </Flex><Flex mb="2" alignItems="center">
        <Icon as={CheckCircleIcon} color="green.500" mr="2" />
        <Text color="gray.500">sed do eiusmod tempor incididunt</Text>
      </Flex>
    </Box>
    <Box>
      <Button
        width="100%"
        rightIcon={<ArrowForwardIcon />}
        backgroundColor="gray.400"
        color="white"
        mb="2"
      >
        Button Text
      </Button>
      <Text color="gray.500" fontSize="sm">
        *At vero eos et accusamus et iusto
      </Text>
    </Box>
  </Box><Box
    width="30%"
    p="4"
    border="2px"
    borderColor="primary.500"
    height="400px"
    display="flex"
    flexDirection="column"
    justifyContent="space-between"
    m="5"
    position="relative"
    borderRadius="md"
  >
    <Box>
      <Text color="gray.500" letterSpacing="widest">PRO</Text>
      <Text fontSize="4xl" fontWeight="600" mb="3">$20</Text>
      <Divider borderColor="gray.200" />

    </Box>
    <Box mt="3" mb="3" height="50%">
      <Flex mb="2" alignItems="center">
        <Icon as={CheckCircleIcon} color="green.500" mr="2" />
        <Text color="gray.500">Lorem ipsum dolor sit amet</Text>
      </Flex><Flex mb="2" alignItems="center">
        <Icon as={CheckCircleIcon} color="green.500" mr="2" />
        <Text color="gray.500">
          Sed ut perspiciatis unde omnis&nbsp;
        </Text>
      </Flex><Flex mb="2" alignItems="center">
        <Icon as={CheckCircleIcon} color="green.500" mr="2" />
        <Text color="gray.500">sed do eiusmod tempor incididunt</Text>
      </Flex><Flex mb="2" alignItems="center">
        <Icon as={CheckCircleIcon} color="green.500" mr="2" />
        <Text color="gray.500">Ut enim ad minima veniam</Text>
      </Flex>
    </Box>
    <Box>
      <Button
        width="100%"
        rightIcon={<ArrowForwardIcon />}
        backgroundColor="primary.500"
        color="white"
        mb="2"
      >
        Button Text
      </Button>
      <Text color="gray.500" fontSize="sm">
        *At vero eos et accusamus et iusto
      </Text>
    </Box>
    <Box
      position="absolute"
      backgroundColor="primary.500"
      color="white"
      pt="1"
      pb="1"
      right="-0"
      top="0"
      borderRadius="md"
      width="24"
      textAlign="center"
    >
      <Text>Popular</Text>
    </Box>
  </Box><Box
    width="30%"
    p="4"
    border="2px"
    borderColor="gray.300"
    height="400px"
    display="flex"
    flexDirection="column"
    justifyContent="space-between"
    m="5"
    borderRadius="md"
  >
    <Box>
      <Text color="gray.500" letterSpacing="widest">BUSSINESS</Text>
      <Text fontSize="4xl" fontWeight="600" mb="3">$30</Text>
      <Divider borderColor="gray.200" />

    </Box>
    <Box mt="3" mb="3" height="50%">
      <Flex mb="2" alignItems="center">
        <Icon as={CheckCircleIcon} color="green.500" mr="2" />
        <Text color="gray.500">Lorem ipsum dolor sit amet</Text>
      </Flex><Flex mb="2" alignItems="center">
        <Icon as={CheckCircleIcon} color="green.500" mr="2" />
        <Text color="gray.500">
          Sed ut perspiciatis unde omnis&nbsp;
        </Text>
      </Flex><Flex mb="2" alignItems="center">
        <Icon as={CheckCircleIcon} color="green.500" mr="2" />
        <Text color="gray.500">sed do eiusmod tempor incididunt</Text>
      </Flex><Flex mb="2" alignItems="center">
        <Icon as={CheckCircleIcon} color="green.500" mr="2" />
        <Text color="gray.500">Quis autem vel eum iure&nbsp;</Text>
      </Flex><Flex mb="2" alignItems="center">
        <Icon as={CheckCircleIcon} color="green.500" mr="2" />
        <Text color="gray.500">sed do eiusmod tempor incididunt</Text>
      </Flex>
    </Box>
    <Box>
      <Button
        width="100%"
        rightIcon={<ArrowForwardIcon />}
        backgroundColor="gray.400"
        color="white"
        mb="2"
      >
        Button Text
      </Button>
      <Text color="gray.500" fontSize="sm">
        *At vero eos et accusamus et iusto
      </Text>
    </Box>
  </Box>
</Flex>
</Box>`

export default Pricing1
