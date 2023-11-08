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
import { deleteUser } from "src/app/actions/User";
import { signOut } from "next-auth/react";

export default function DeleteDialog(deleteStatus, email) {
  const { onClose } = useDisclosure();

  const cancelRef = React.useRef();

  const handleDelete = () => {
    deleteUser({ email }).then((response) => {
      if (response.ok) {
        {
          signOut({ callbackUrl: "/Auth/Logout" });
        }
      } else {
        alert("User could not be deleted. Please try again.");
      }
    });
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
              <Link href="/Dashboard/Profile">
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
              <Button
                bgColor={"#70A0AF"}
                color={"white"}
                _hover={{ bgColor: "red", color: "white" }}
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
