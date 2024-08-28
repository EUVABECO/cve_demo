import { Nuva } from '@syadem/nuva';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Divider,
  AbsoluteCenter,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from '@chakra-ui/react';
import { VaccinationEntryForm } from './components/VaccinationEntryForm';
import useStore from './store';
import { VaccinationList } from './components/VaccinationList';
import { sendRpcRequest } from './rpcClient';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import { useZxing } from "react-zxing";

function App() {
  const {
    firstName,
    lastName,
    birthdate,
    vaccinationEntries,
    setFirstName,
    setLastName,
    setBirthdate,
    addVaccinationEntry,
  } = useStore();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const qrCodeDisclosure = useDisclosure()
  const [nuvaId, setNuvaId] = useState(null);
  const [date, setDate] = useState(null);
  const [nuva, setNuva] = useState(null);

  useEffect(() => {
    (async () => {
      const nuva = await Nuva.load();
      setNuva(nuva);
    })();
  }, []);

  const getPDF = async (event) => {
    event.preventDefault();
    console.log('Store content:', {
      firstName,
      lastName,
      birthdate,
      vaccinationEntries
    });

    const bod = new Date(birthdate)
    const cve = {
      "ver": "1.0.0",
      "nam": {
        "fnt": firstName,
        "gnt": lastName
      },
      "dob": birthdate,
      "v": vaccinationEntries.map(entry => ({
        "o": "SYA",
        "i": Math.floor(Math.random() * 10000),
        "a": (new Date(entry.date) - bod) / (1000 * 3600 * 24),
        "mp": entry.nuvaId
      }))
    };
    console.log('cve:', JSON.stringify(cve));
    const response = await sendRpcRequest('to_hcert_pdf', { hcert_data: cve });

    const binaryString = window.atob(response.result)
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "evc.pdf";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddVaccinationAct = () => {
    addVaccinationEntry(parseInt(nuvaId), date)
    setNuvaId(null)
    setDate(null)
    onClose()
  }

  const hcertToStore = async (hcert) => {
    const response = await sendRpcRequest('from_hcert', { hcert });
    if (response.result.verified) {
      setFirstName(response.result.payload.nam.fnt);
      setLastName(response.result.payload.nam.gnt);
      setBirthdate(response.result.payload.dob);
      const dob = new Date(response.result.payload.dob)
      console.log('dob:', dob);
      response.result.payload.v.forEach(v => {
        const vaccineDate = new Date(dob);
        vaccineDate.setDate(vaccineDate.getDate() + v.a);
        addVaccinationEntry(v.mp, vaccineDate.toISOString().split('T')[0]);
      });
    }
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        const info = await pdf.getMetadata();
        const hcert = JSON.parse(info.info.Custom.data).hcert
        hcertToStore(hcert);
      }
      fileReader.readAsArrayBuffer(file);
    }
  };

  const { ref } = useZxing({
    onDecodeResult(result) {
      handleQrCode(result);
    },
  });

  const handleQrCode = async (data) => {
    if (data) {
      hcertToStore(data.getText());
    }
  }

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg">
      <Heading mb={6} textAlign="center">
        EVC demo
      </Heading>

      <Tabs>
        <TabList>
          <Tab>Create</Tab>
          <Tab>Load</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box position='relative' padding='10'>
              <Divider />
              <AbsoluteCenter bg='white' px='4'>
                Identity
              </AbsoluteCenter>
            </Box>
            <Stack spacing={2}>
              <FormControl id="first-name" isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  placeholder="Your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  size='sm'
                />
              </FormControl>
              <FormControl id="last-name" isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  placeholder="Your nom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  size='sm'
                />
              </FormControl>
              <FormControl id="birthdate" isRequired>
                <FormLabel>Birthdate</FormLabel>
                <Input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  size='sm'
                />
              </FormControl>

              <Button colorScheme="blue" type="submit" width="full" onClick={getPDF}>
                Get the Vaccination Card
              </Button>
            </Stack>


            <Box position='relative' padding='10'>
              <Divider />
              <AbsoluteCenter bg='white' px='4'>
                Vaccinations
              </AbsoluteCenter>
            </Box>

            <VaccinationList entries={vaccinationEntries} nuva={nuva} />
            <Button colorScheme="blue" onClick={onOpen} width="full">
              Add a vaccination act
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VaccinationEntryForm nuva={nuva} setNuvaId={setNuvaId} setDate={setDate} />
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button variant='blue' onClick={handleAddVaccinationAct}>Add</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>


          </TabPanel>
          <TabPanel>
          <Box position='relative' padding='10'>
              <Divider />
              <AbsoluteCenter bg='white' px='4'>
                Verify QrCode
              </AbsoluteCenter>
            </Box>
            <video ref={ref} />
            <Box position='relative' padding='10'>
              <Divider />
              <AbsoluteCenter bg='white' px='4'>
                Verify A PDF
              </AbsoluteCenter>
            </Box>
            <Input placeholder='Pdf' size='md' type='file' onChange={handleFileChange} />
            <Box position='relative' padding='10'>
              <Divider />
              <AbsoluteCenter bg='white' px='4'>
                Result
              </AbsoluteCenter>
            </Box>
            First Name: {firstName} <br />
            Last Name: {lastName} <br />
            Birthdate: {birthdate} <br />
            Vaccinations: <br />
            <VaccinationList entries={vaccinationEntries} nuva={nuva} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default App;

