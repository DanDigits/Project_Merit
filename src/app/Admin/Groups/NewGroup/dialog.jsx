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
      {status === "New" && (
        <AlertDialog
          isOpen={status}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Group created successfully.
              </AlertDialogHeader>

              <AlertDialogBody>
                Would you like to create another group?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Link href="/Admin/Groups/ViewGroup">
                  <Button
                    bgColor={"#7eb67d"}
                    color={"#black"}
                    _hover={{ bgColor: "#031926", color: "white" }}
                    ref={cancelRef}
                    onClick={onClose}
                  >
                    No
                  </Button>
                </Link>

                <Link href="/Dashboard/NewGroup">
                  <Button
                    bgColor={"#6abbc4"}
                    color={"black"}
                    _hover={{ bgColor: "#031926", color: "white" }}
                    ml={3}
                  >
                    Yes
                  </Button>
                </Link>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
      {status === "Edit" && (
        <AlertDialog
          isOpen={status}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Group successfully updated.
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Link href="/Admin/Group">
                  <Button
                    bgColor={"#6abbc4"}
                    color={"black"}
                    _hover={{ bgColor: "#031926", color: "white" }}
                    ref={cancelRef}
                    onClick={onClose}
                  >
                    Continue
                  </Button>
                </Link>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
}
