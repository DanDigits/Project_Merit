"use client";
/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import { redirect } from "next/navigation";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Card,
  HStack,
  Heading,
  Input,
  Button,
  ButtonGroup,
  Link,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import User from "./user";
//import {deleteUser} from "";
import secureLocalStorage from "react-secure-storage";

export default function Page() {
  const [mode, setMode] = useState("View");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userEmail = String(secureLocalStorage.getItem("userEmail"));

  const handleDelete = () => {
    deleteUser({ userEmail }).then((response) => {
      if (response.ok) {
        {
          window.location.replace("/Admin/User");
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
              {User}
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
                  form="sup-form"
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
