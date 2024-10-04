import { Box, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';

export const VaccinationEntryForm = (props) => {
  const { nuva, setNuvaId, setDate } = props;
  if (nuva === null || nuva === undefined) {
    return <></>;
  }
  const sortedVaccines = nuva.repositories.vaccines.all()
  .filter(v => v.codes.length > 8) // limit vaccine list
  .sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  })
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Select variant='outline' placeholder='Vaccine' onChange={(e) => setNuvaId(e.target.value)}>
        {
          sortedVaccines.map(vaccine => (
            <option value={vaccine.code}>{vaccine.name}</option>
          ))
        }
      </Select>
      <FormControl id={`vaccine-date`} isRequired>
        <FormLabel>Vaccination act date</FormLabel>
        <Input
          type="date"
          onChange={(e) => setDate(e.target.value)}
        />
      </FormControl>
    </Box>
  );
};


