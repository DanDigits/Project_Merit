"use client";
/* eslint-disable no-unused-vars */
import React from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Heading,
  Link,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import Report from "./report";
import Dialog from "./dialog.jsx";
import { createReport } from "./../../actions/Report.js";

/* 
  report.jsx has been updated. The email variable needs to be sent to the
  createReport function as well so if the submit function moves to the report page 
  you may want to move the useEffect call to report.jsx as well so you don't have 
  to pass it another way.

  I went ahead and moved the dialog box to its own componenet as well.
  It is called by setting createStatus to true. Do you think that can be passed
  as a prop as well.

  Let me know if you have any questions or need help. 
  Thank you!
*/

export default function Page() {
  const [createStatus, setCreateStatus] = useState(false);
  const [title, setTitle] = useState("");
  const [quarter, setQuarter] = useState(1);
  const [date, setDate] = useState(""); // needs to default to current date
  const [report, setReport] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    getSession().then((session) => setEmail(session.user.email));
  }, []);

  const handleSubmitInfo = (e) => {
    e.preventDefault();

    createReport({ title, email, date, quarter, report }).then((response) => {
      if (response.ok) {
        {
          setCreateStatus(true);
        }
      } else {
        alert("Report could not be created. Please try again.");
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
          <Heading color="#331E38">Create Report</Heading>
          <br />
          <form>
            {Report(email)}
            <ButtonGroup>
              <Link href="/Dashboard/Home">
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
                onClick={(e) => handleSubmitInfo(e)}
              >
                Submit
              </Button>
            </ButtonGroup>
          </form>
        </VStack>
      </Card>
      {Dialog()}
    </>
  );
}
