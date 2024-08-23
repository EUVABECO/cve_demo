import React from 'react';
import { Box, FormControl, FormLabel, Input } from '@chakra-ui/react';

const VaccinationEntryForm = ({ id, name, date, onChange }) => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <FormControl id={`vaccine-name-${id}`} isRequired>
        <FormLabel>Nom du vaccin</FormLabel>
        <Input
          placeholder="Nom du vaccin"
          value={name}
          onChange={(e) => onChange(id, 'name', e.target.value)}
        />
      </FormControl>
      <FormControl id={`vaccine-date-${id}`} isRequired>
        <FormLabel>Date de vaccination</FormLabel>
        <Input
          type="date"
          value={date}
          onChange={(e) => onChange(id, 'date', e.target.value)}
        />
      </FormControl>
    </Box>
  );
};

export default VaccinationEntryForm;
