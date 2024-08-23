import React from 'react';
import { Box, FormControl, FormLabel, Input } from '@chakra-ui/react';
import useStore from '../store';

const VaccinationEntryForm = ({ id }) => {
  const { vaccinationEntries, updateVaccinationEntry } = useStore();
  const entry = vaccinationEntries.find((entry) => entry.id === id);

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <FormControl id={`vaccine-name-${id}`} isRequired>
        <FormLabel>Nom du vaccin</FormLabel>
        <Input
          placeholder="Nom du vaccin"
          value={entry.name}
          onChange={(e) => updateVaccinationEntry(id, 'name', e.target.value)}
        />
      </FormControl>
      <FormControl id={`vaccine-date-${id}`} isRequired>
        <FormLabel>Date de vaccination</FormLabel>
        <Input
          type="date"
          value={entry.date}
          onChange={(e) => updateVaccinationEntry(id, 'date', e.target.value)}
        />
      </FormControl>
    </Box>
  );
};

export default VaccinationEntryForm;
