"use client";
/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Card,
  Heading,
  Button,
  ButtonGroup,
  Link,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import User from "./user";
import secureLocalStorage from "react-secure-storage";
import { deleteUser } from "./../../../actions/User.js";

export default function Page() {
  const { data: session } = useSession();
  const [role, setRole] = useState("");
  const [mode, setMode] = useState("View");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState(
    String(secureLocalStorage.getItem("email"))
  );
  var userArray = [];

  const handleDelete = () => {
    userArray.push(email);
    console.log("Attempting to delete account: " + userArray);
    deleteUser({ userArray }).then((response) => {
      if (response.ok) {
        {
          window.location.replace("/Admin/Users");
        }
      } else {
        alert("Delete failed");
      }
    });
  };

  return (
    <>
      <Card
        p={{ base: 0, md: 2 }}
        mx={{ base: -4, md: 0 }}
        alignSelf={"center"}
        size={{ base: "sm", md: "lg" }}
        w={{ md: "100%" }}
        bgColor={"white"}
      >
        <VStack m="5vh">
          <Heading color="#331E38">{mode}</Heading>
          <br />
          {mode === "View" && (
            <>
              {User(mode)}
              <ButtonGroup>
                <Link href="/Admin/Users">
                  <Button
                    bgColor={"#7eb67d"}
                    color={"#black"}
                    _hover={{ bgColor: "#031926", color: "white" }}
                  >
                    Back
                  </Button>
                </Link>
                <Button
                  bgColor={"#6abbc4"}
                  color={"black"}
                  _hover={{ bgColor: "#031926", color: "white" }}
                  onClick={() => setMode("Edit")}
                >
                  Edit
                </Button>
              </ButtonGroup>
            </>
          )}
          {mode === "Edit" && (
            <>
              {User(mode)}
              <ButtonGroup>
                <Button
                  bgColor={"#FFC370"}
                  color={"black"}
                  _hover={{ bgColor: "#DF2935", color: "white" }}
                  onClick={onOpen}
                >
                  Delete
                </Button>
                <AlertDialog isOpen={isOpen} onClose={onClose}>
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete User
                      </AlertDialogHeader>
                      <AlertDialogBody>Are you sure?</AlertDialogBody>
                      <AlertDialogFooter>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                          colorScheme="red"
                          onClick={() => {
                            handleDelete();
                          }}
                          ml={3}
                        >
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
                <Button
                  bgColor={"#7eb67d"}
                  color={"#black"}
                  _hover={{ bgColor: "#031926", color: "white" }}
                  onClick={() => setMode("View")}
                >
                  Cancel
                </Button>
                <Button
                  bgColor={"#6abbc4"}
                  color={"black"}
                  _hover={{ bgColor: "#031926", color: "white" }}
                  form="user-form"
                  type="submit"
                >
                  Update
                </Button>
              </ButtonGroup>
            </>
          )}
        </VStack>
      </Card>
    </>
  );
}
