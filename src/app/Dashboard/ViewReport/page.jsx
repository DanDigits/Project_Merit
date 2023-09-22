"use client";
/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from "react";
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
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { updateReport, getReport } from "src/app/actions/Report";
import { getSession } from "next-auth/react";
import Report from "../NewReport/report";

export default function Page() {
  const [mode, setMode] = useState("View");
  const [data, setData] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [title, setTitle] = useState("");
  const [quarter, setQuarter] = useState("");
  const [date_of_creation, setDate] = useState("");
  const [report, setReport] = useState("");

  const [email, setEmail] = useState("");
  const [reportId, setReportId] = useState("6504ee2cf2bb6994e6dc8129");
  const [entry, setEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);
  const [hasReportId, setHasReportId] = useState(false);
  //const [bucket, setBucket] = useState("");

  useEffect(() => {
    if (reportId !== "" && reportId !== null) {
      setHasReportId(true);
      console.log("hasReportId:", reportId);
    } else {
      console.log("reportId missing");
    }
    if (entry !== null) {
      setHasEntry(true);
      console.log("hasEntry:", entry);
    }
    if (hasReportId && !hasEntry) {
      console.log("hasReportId && !hasEntry", reportId, hasEntry);
      setIsLoading(true);
      setHasError(false);
      getReport({ reportId }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setEntry(response))
              .then(setHasEntry(true))
          : setHasError(true);
      });
    }
    if (hasReportId && hasEntry) {
      console.log("hasReportId && hasEntry", reportId, hasEntry);
      var arr = JSON.parse(JSON.stringify(entry));
      if (arr) {
        console.log(arr.title);
        console.log(arr.quarter);
        console.log(arr.date);
        console.log(arr.report);

        setTitle(arr.title);
        setQuarter(arr.quarter);
        setDate(arr.date);
        setReport(arr.report);
        setIsLoading(false);
      }
    }
  }, [hasEntry, hasReportId, reportId, entry]);

  const handleSubmitInfo = (e) => {
    e.preventDefault();

    updateReport(reportId, title, email, date_of_creation, quarter, data).then(
      () => {
        alert("Successfully updated the report.");
        setMode("View");
      }
    );
  };

  return (
    <>
      <Card
        p={2}
        alignSelf={"center"}
        size={{ base: "sm", md: "lg" }}
        bgColor={"white"}
      >
        <VStack m="5vh">
          <Heading color="#331E38">{mode}</Heading>
          <br />
          {mode === "View" && (
            <>
              {Report(mode)}
              <Button
                bgColor={"#70A0AF"}
                color={"white"}
                _hover={{ bgColor: "#706993", color: "white" }}
                onClick={() => setMode("Edit")}
              >
                Edit
              </Button>
            </>
          )}
          {mode === "Edit" && (
            <>
              {Report(mode)}
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
                        <Button colorScheme="red" onClick={onClose} ml={3}>
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
                  onClick={() => setMode("View")} // This needs to be updated to reload the view with the report id
                >
                  Cancel
                </Button>
                <Button
                  bgColor={"#70A0AF"}
                  color={"white"}
                  _hover={{ bgColor: "#706993", color: "white" }}
                  form="report-form"
                  type="submit"
                  onClickCapture={() => setMode("View")}
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
