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
import Report from "../NewReport/report";
import { deleteReport } from "./../../actions/Report.js";
import secureLocalStorage from "react-secure-storage";

export default function Page() {
  const [mode, setMode] = useState("View");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reportId, setReportId] = useState(
    String(secureLocalStorage.getItem("reportID"))
  );

  const handleDelete = () => {
    deleteReport({ reportId }).then((response) => {
      if (response.ok) {
        {
          window.location.replace("/Dashboard/Reports");
        }
      } else {
        alert("Delete failed");
      }
    });
  };

  return (
    <>
      <Card
        p={2}
        alignSelf={"center"}
        size={{ base: "sm", md: "lg" }}
        w={'{ md: "lg" }'}
        bgColor={"white"}
      >
        <VStack m="5vh">
          <Heading color="#331E38">{mode}</Heading>
          <br />
          {mode === "View" && (
            <>
              {Report(mode)}
              <ButtonGroup>
                <Link href="/Dashboard/Reports">
                  <Button
                    bgColor={"#A0C1B9"}
                    color={"#331E38"}
                    _hover={{ bgColor: "#706993", color: "white" }}
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  bgColor={"#70A0AF"}
                  color={"white"}
                  _hover={{ bgColor: "#706993", color: "white" }}
                  onClick={() => setMode("Edit")}
                >
                  Edit
                </Button>
              </ButtonGroup>
            </>
          )}
          {mode === "Edit" && (
            <>
              {Report(mode, reportId)}
              <ButtonGroup>
                <Button
                  bgColor={"#F4E8C1"}
                  color={"black"}
                  _hover={{ bgColor: "red", color: "white" }}
                  onClick={onOpen}
                >
                  Delete
                </Button>
                <AlertDialog isOpen={isOpen} onClose={onClose}>
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete Report
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
                  bgColor={"#A0C1B9"}
                  color={"#331E38"}
                  _hover={{ bgColor: "#706993", color: "white" }}
                  onClick={() => setMode("View")}
                >
                  Cancel
                </Button>
                <Button
                  bgColor={"#70A0AF"}
                  color={"white"}
                  _hover={{ bgColor: "#706993", color: "white" }}
                  form="report-form"
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
