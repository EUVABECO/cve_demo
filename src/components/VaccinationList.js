import {
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react';

export const VaccinationList = (props) => {
  const { entries, nuva } = props;
  if (nuva === null || nuva === undefined) {
    return <></>;
  }
  if (entries.length === 0) {
    return <>Empty</>;
  }
  return (
    <TableContainer>
      <Table variant='striped' colorScheme='blue' size='sm'>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Vaccine</Th>
          </Tr>
        </Thead>
        <Tbody>
          {entries.map(entry => (
            <VaccinationEntry key={entry.id} {...entry} nuva={nuva} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const VaccinationEntry = (props) => {
  const { date, nuvaId, nuva } = props;
  const vaccine = nuva.repositories.vaccines.all().find((v) => v.code === nuvaId)
  return (
    <Tr>
      <Td>{date}</Td>
      <Td>{vaccine.name}</Td>
    </Tr>
  );
}