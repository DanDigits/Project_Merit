"use client";
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
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
//import { deleteUser } from "src/app/actions/User";

export default function GroupDialog(status) {
  const { onClose } = useDisclosure();
  const [email, setEmail] = useState("");
  const cancelRef = React.useRef();

  useEffect(() => {
    getSession().then((session) => setEmail(session.user.email));
    console.log("Email:", email);
  });

  const handleRequest = () => {
    /*(requestLeave({ email }).then((response) => {
      if (response.ok) {
        {
          alert("Request sent. Please followup group leader.");
        }
      } else {
        alert("Unable to process request. Please try again.");
      }
    });*/
  };

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
              Confirmation
            </AlertDialogHeader>

            <AlertDialogBody>
              Do you want to request to leave this group?
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
                onClick={() => handleRequest()}
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
