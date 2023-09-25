"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

export default function DeleteDialog(deleteStatus) {
  const { onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const handleDelete = (e) => {
    e.preventDefault();
    console.log("Have you hooked up delete yet?");
  };

  return (
    <>
      <AlertDialog
        isOpen={deleteStatus}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmation
            </AlertDialogHeader>

            <AlertDialogBody>
              Deleted accounts cannot be recovered. Are you sure?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                bgColor={"#A0C1B9"}
                color={"#331E38"}
                _hover={{ bgColor: "#706993", color: "white" }}
                ref={cancelRef}
                onClick={onClose}
              >
                No
              </Button>
              <Button
                bgColor={"#70A0AF"}
                color={"white"}
                _hover={{ bgColor: "#706993", color: "white" }}
                ml={3}
                onClick={() => handleDelete()}
              >
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
