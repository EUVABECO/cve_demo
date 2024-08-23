import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  VStack,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import VaccinationEntryForm from './components/VaccinationEntryForm';

function App() {
  const [vaccinationEntries, setVaccinationEntries] = useState([]);
  const [formStatus, setFormStatus] = useState({ success: false, error: false });

  const addVaccinationEntry = () => {
    setVaccinationEntries([...vaccinationEntries, { id: Date.now(), name: '', date: '' }]);
  };

  const handleVaccinationEntryChange = (id, field, value) => {
    setVaccinationEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      firstName: event.target['first-name'].value,
      lastName: event.target['last-name'].value,
      birthdate: event.target['birthdate'].value,
      vaccinationEntries
    };

    try {
      const response = await fetch('https://your-server-endpoint.com/api/vaccination-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Form submitted successfully:', result);
      setFormStatus({ success: true, error: false });
      // Clear the form
      event.target.reset();
      setVaccinationEntries([]);
    } catch (error) {
      console.error('There was a problem with the form submission:', error);
      setFormStatus({ success: false, error: true });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg">
      <Heading mb={6} textAlign="center">
        Carnet de Vaccination
      </Heading>
      {formStatus.success && (
        <Alert status="success" mb={4}>
          <AlertIcon />
          Form submitted successfully!
        </Alert>
      )}
      {formStatus.error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          There was a problem with the form submission.
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="first-name" isRequired>
            <FormLabel>Prénom</FormLabel>
            <Input placeholder="Votre prénom" />
          </FormControl>

          <FormControl id="last-name" isRequired>
            <FormLabel>Nom</FormLabel>
            <Input placeholder="Votre nom" />
          </FormControl>

          <FormControl id="birthdate" isRequired>
            <FormLabel>Date de naissance</FormLabel>
            <Input type="date" />
          </FormControl>

          <VStack spacing={4} align="stretch">
            {vaccinationEntries.map((entry) => (
              <VaccinationEntryForm
                key={entry.id}
                id={entry.id}
                name={entry.name}
                date={entry.date}
                onChange={handleVaccinationEntryChange}
              />
            ))}
          </VStack>

          <Button colorScheme="blue" onClick={addVaccinationEntry} width="full">
            Ajouter une vaccination
          </Button>

          <Button colorScheme="blue" type="submit" width="full">
            Soumettre
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default App;
