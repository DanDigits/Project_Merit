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
import Supervisor from "../ViewSupervisor/supervisor";

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
  const mode = "New";
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
          <Heading color="#331E38">Create Supervisor</Heading>
          <br />

          {Supervisor(mode)}
          <ButtonGroup>
            <Link href="/Admin/Supervisors">
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
              form="sup-form"
              type="submit"
            >
              Submit
            </Button>
          </ButtonGroup>
        </VStack>
      </Card>
    </>
  );
}
