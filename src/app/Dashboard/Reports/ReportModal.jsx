import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";

const ReportModal = (props) => {
  const { isOpen, onClose, report } = props;

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{report.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold">Quarter: {report.quarter}</Text>
            <Text fontWeight="bold">Year: {report.year}</Text>
            <Text fontWeight="bold">Report Contents:</Text>
            <Text>{report.data}</Text>
          </ModalBody>

          <ModalFooter>
            <Button backgroundColor="lightblue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ReportModal;
