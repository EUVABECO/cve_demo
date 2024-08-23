import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  Heading
} from '@chakra-ui/react';

function App() {
  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg">
      <Heading mb={6} textAlign="center">
        Carnet de Vaccination
      </Heading>
      <form>
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

          <FormControl id="vaccination-history">
            <FormLabel>Historique vaccinal</FormLabel>
            <Textarea placeholder="Détail des vaccins administrés" />
          </FormControl>

          <Button colorScheme="blue" type="submit" width="full">
            Soumettre
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default App;
