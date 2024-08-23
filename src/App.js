import React from 'react';
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
import useStore from './store';

function App() {
  const {
    firstName,
    lastName,
    birthdate,
    vaccinationEntries,
    formStatus,
    setFirstName,
    setLastName,
    setBirthdate,
    addVaccinationEntry,
    updateVaccinationEntry,
    setFormStatus,
    resetForm
  } = useStore();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      firstName,
      lastName,
      birthdate,
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
      resetForm();
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
            <Input
              placeholder="Votre prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </FormControl>

          <FormControl id="last-name" isRequired>
            <FormLabel>Nom</FormLabel>
            <Input
              placeholder="Votre nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </FormControl>

          <FormControl id="birthdate" isRequired>
            <FormLabel>Date de naissance</FormLabel>
            <Input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </FormControl>

          <VStack spacing={4} align="stretch">
            {vaccinationEntries.map((entry) => (
              <VaccinationEntryForm
                key={entry.id}
                id={entry.id}
                name={entry.name}
                date={entry.date}
                onChange={updateVaccinationEntry}
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
