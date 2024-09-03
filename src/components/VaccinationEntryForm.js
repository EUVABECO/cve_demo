import { Box, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';

export const VaccinationEntryForm = (props) => {
  const { nuva, setNuvaId, setDate } = props;
  if (nuva === null || nuva === undefined) {
    return <></>;
  }
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Select variant='outline' placeholder='Vaccine' onChange={(e) => setNuvaId(e.target.value)}>
        {
          nuva.repositories.vaccines.all().sort().map(vaccine => (
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


