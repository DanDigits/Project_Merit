/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Heading,
  Link,
  VStack,
} from "@chakra-ui/react";
import urls from "utils/urls";
import { createReport } from "src/actions/Report";
import { useEffect } from "react";
import { getSession } from "next-auth/react";
import Layout from "src/app/Index/layout";
import Report from "./report";

export default function Page() {
  const [mode, setMode] = useState("Create New Report");
  const [title, setTitle] = useState("");
  const [quarter, setQuarter] = useState("");
  const [date_of_creation, setDate] = useState(""); // needs to default to current date
  const [report, setReport] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    getSession().then((session) => setEmail(session.user.email));
  }, []);

  const handleSubmitInfo = (e) => {
    e.preventDefault();

    createReport(title, email, date_of_creation, quarter, report).then(() => {
      alert("Successfully created new report.");
      setMode("Login");
    });
  };

  return (
    <>
      <Card
        p={2}
        alignSelf={"center"}
        size={{ base: "sm", md: "md" }}
        w={{ md: "lg" }}
        bgColor={"white"}
      >
        <VStack m="10vh">
          <Heading color="#331E38">{mode}</Heading>
          <br />
          <Report />
          <ButtonGroup>
          <Link href="/">
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
        </VStack>
      </Card>
    </>
  );
}

Page.getLayout = function (page) {
  return <Layout>{page}</Layout>;
};
