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
  Link,
  useDisclosure,
} from "@chakra-ui/react";

export default function Dialog(status) {
  const { onClose } = useDisclosure();
  const cancelRef = React.useRef();
  return (
    <>
      <AlertDialog
        isOpen={status}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Report created successfully.
            </AlertDialogHeader>

            <AlertDialogBody>
              Would you like to create another report?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Link href="/Dashboard/Reports">
                <Button
                  bgColor={"#A0C1B9"}
                  color={"#331E38"}
                  _hover={{ bgColor: "#706993", color: "white" }}
                  ref={cancelRef}
                  onClick={onClose}
                >
                  No
                </Button>
              </Link>

              <Link href="/Dashboard/NewReport">
                <Button
                  bgColor={"#70A0AF"}
                  color={"white"}
                  _hover={{ bgColor: "#706993", color: "white" }}
                  ml={3}
                >
                  Yes
                </Button>
              </Link>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}