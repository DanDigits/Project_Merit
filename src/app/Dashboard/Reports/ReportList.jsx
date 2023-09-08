import {
  Box,
  Heading,
  UnorderedList,
  Text,
  ListItem,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import ReportModal from "./ReportModal";

const ReportList = ({ reports }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Heading>Past Reports</Heading>
      <UnorderedList>
        {reports.map(({ name, data, date_of_creation, quarter, year }) => (
          <ListItem key={name}>
            <Text fontWeight="bold">{name + " " + date_of_creation}</Text>
            <Text>{data}</Text>
            <Button color="black" onClick={onOpen}>
              View
            </Button>
            <ReportModal
              isOpen={isOpen}
              onClose={onClose}
              report={{ name, data, date_of_creation, quarter, year }}
            />
            <Box h="1em" />
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default ReportList;
