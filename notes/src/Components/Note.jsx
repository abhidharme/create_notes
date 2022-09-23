import {
  SimpleGrid,
  Stack,
  Box,
  useColorModeValue,
  Flex,
  Text,
  Button,
  Center,
  Input,
  FormLabel,
  Textarea,
  Divider,
  InputLeftElement,
  InputGroup,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableContainer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import {
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdFacebook,
  MdOutlineEmail,
} from 'react-icons/md';
import { useEffect, useState } from 'react';
import { BsPerson } from 'react-icons/bs';
import { BiSearchAlt, BiEditAlt } from 'react-icons/bi';
import { TiDelete } from 'react-icons/ti';
import axios from 'axios';




export default function Note() {

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [writenote, setWriteNote] = useState("" || []);
  const [changenote, setChangeNote] = useState("");
    const [search, setSearch] = useState();
    const [notedata, setNotedata] = useState([]);
    const [searchId, setSearchId] = useState();


  const createNotes = () => {

    axios.post('https://note-create.herokuapp.com/notes', {
      myNote: writenote
    })
      .then(() => getNotes())

  }



  const deleteNote = (id) => {
    axios.delete(`https://note-create.herokuapp.com/notes/${id}`)
      .then(() => getNotes())
  }

  const getNotes = () => {
    axios.get('https://note-create.herokuapp.com/notes')
      .then((res) => setNotedata(res.data))
      .catch((err) => console.log(err.message))
  }

  const updateNotes = (id) => {

    axios.patch(`https://note-create.herokuapp.com/notes/${id}`,{
      myNote:`${writenote}`
    })
      .then(() => getNotes())
  }

  useEffect(() => {
    getNotes();
  }, []);



  return (
    <Center bg="gray.100" maxW={'full'} py={12}>
      <Box borderRadius={'sm'} p={'5'} boxShadow='rgba(0, 0, 0, 0.35) 0px 5px 15px'>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} >
          <Stack spacing={4}>
            <Text
              textTransform={'uppercase'}
              color={'white'}
              fontWeight={600}
              fontSize={'lg'}
              bg={useColorModeValue('#630094', '#630094')}
              width="100%"
              textAlign={'center'}
              pt="30px"
              pb="30px"
              rounded={'sm'}>
              Create Notes
            </Text>
            <Center
              width={'500px'}
              bg="#630094"
              color="white"
              borderRadius="sm"
              m={{ sm: 4, md: 5, lg: 10 }}
              p={{ sm: 5, md: 5, lg: 10 }}>
              <Box p={4}>
                <Center spacing={{ base: 20, sm: 3, md: 5, lg: 10 }}>
                  <Box bg="white" borderRadius="sm">
                    <Box m={8} color="#0B0E3F">
                      <h5>Note</h5>
                      <Textarea
                        w={'300px'}
                        borderColor="gray.300"
                        _hover={{
                          borderRadius: 'gray.300',
                        }}
                        placeholder="Write Note"
                        onChange={(e) => setWriteNote(e.target.value)}
                      />
                      <br />
                      <br />
                      <Button
                        w={'300px'}
                        variant="solid"
                        bg="#8a2be2"
                        color="white"
                        _hover={{}}
                        onClick={createNotes}>
                        Create Notes
                      </Button>
                    </Box>
                  </Box>
                </Center>
              </Box>
            </Center>
          </Stack>

          <Flex>
            <Box width="100%" height={'650px'} position="relative" >
            <Box width={'100%'} position={'absolute'} color={'white'} top="20px"  bg="#630094" borderRadius={'lg'} >
            <br/>
            {
            notedata.filter((value) => {
                  if (search == "") {
                      return "";
                  }
                  else if (value.myNote.toLowerCase().includes(search)) {
                      return value;
                  }
              })
                  .map((item) => <Box onClick={() => setSearchId(item.id)} style={{ textDecoration: "none", color: "white" }}><Divider/><Text ml={'40px'}   key={item.id} >{item.myNote}</Text></Box>)
          }

            </Box>
              <Box w={'100%'} position={'absolute'} top="-1px">
                <InputGroup mt={'2px'}>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<BiSearchAlt fontSize={'25px'} color="white" />}
                  />
                  <Input
                  variant='none'
                    type={'text'}
                    border='0px'
                    color="white"
                    placeholder={'Search Notes'}
                    bg="#630094"
                    rounded={'lg'}
                    onChange={(e)=>setSearch(e.target.value)}
                  />
                </InputGroup>
              </Box>

              {notedata.length == 0 ? null : <TableContainer mt={'60px'}>
                <Table variant='striped' colorScheme="purple" maxW={'100%'} overflow="hidden"   >
                  <Thead>
                    <Tr>
                      <Th w={'60%'} >Notes</Th>
                      <Th>Edit</Th>
                      <Th>Delete</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {notedata.filter((e)=>{
                      if(searchId>0){
                        return e.id == searchId
                      }
                      else{
                        return e.id
                      }
                    }).map((ele) => (
                      <Tr key={ele.id} >
                        <Td maxW={{ base: '200px', md: "250px", lg: "300px" }}>
                          <Text>{ele.myNote}</Text>
                        </Td>
                        <Td><Box  cursor={'pointer'}p={'3'} onClick={onOpen} borderRadius={'full'} border={'1px solid purple'} color={"purple"}><BiEditAlt fontSize={'24px'} /></Box>
                          <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader color={'purple'} >Edit Note</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody>
                                <Textarea
                                  borderColor="gray.300"
                                  _hover={{
                                    borderRadius: 'gray.300',
                                  }}
                                  placeholder="Write Note"
                                  onChange={(e) => setWriteNote(e.target.value)} />
                              </ModalBody>

                              <ModalFooter>
                                <Button onClick={() => {updateNotes(ele.id);onClose()}} colorScheme='purple'>Confirm</Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                        </Td>
                        <Td><Box cursor={'pointer'} p={'3'} onClick={() => deleteNote(ele.id)} bg="purple" borderRadius={'full'} border={'1px solid purple'} color={"white"}><TiDelete fontSize={'24px'} /></Box></Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              }
            </Box>
          </Flex>

        </SimpleGrid>
      </Box>
    </Center>
  );
}