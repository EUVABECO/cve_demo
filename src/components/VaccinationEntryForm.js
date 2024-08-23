import React, { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel, Input, List, ListItem } from '@chakra-ui/react';
import { Nuva } from '@syadem/nuva';
import useStore from '../store';

const VaccinationEntryForm = ({ id }) => {
  const { vaccinationEntries, updateVaccinationEntry } = useStore();
  const entry = vaccinationEntries.find((entry) => entry.id === id);
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    (async () => {
        const nuva = await Nuva.load();
      if (query) {
        // const results = nuva.queries.searchVaccines(query);
        setSuggestions([]);
      } else {
        setSuggestions([]);
      }
    })();
    
  }, [query]);

  const handleSelectSuggestion = (vaccine) => {
    updateVaccinationEntry(id, 'name', vaccine.name);
    setQuery(vaccine.name);
    setSuggestions([]);
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <FormControl id={`vaccine-name-${id}`} isRequired>
        <FormLabel>Nom du vaccin</FormLabel>
        <Input
          placeholder="Nom du vaccin"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {suggestions.length > 0 && (
          <List mt={2} borderWidth="1px" borderRadius="md">
            {suggestions.map((vaccine) => (
              <ListItem
                key={vaccine.id}
                p={2}
                cursor="pointer"
                _hover={{ backgroundColor: 'gray.100' }}
                onClick={() => handleSelectSuggestion(vaccine)}
              >
                {vaccine.name}
              </ListItem>
            ))}
          </List>
        )}
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
