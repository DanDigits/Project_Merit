"use client";
/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  ButtonGroup,
  Card,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { createReport } from "src/app/actions/Report";
import { useEffect } from "react";
import { getSession } from "next-auth/react";
//import Report from "./report";

export default function Page() {
  const [mode, setMode] = useState("Create New Report");
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

    createReport({ title, email, date, quarter, report }).then(() => {
      alert("Successfully created new report.");
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
          <div className="flex">
            <FormControl id="title" isRequired>
              <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                Title
              </FormLabel>
              <Input
                type=""
                value={title}
                maxLength={64}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#ECECEC"
                mb={3}
                size={"md"}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <HStack mb="3">
              <FormControl id="quarter" isRequired>
                <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                  Quarter
                </FormLabel>
                <Select
                  defaultValue={1}
                  placeholder="Select Quarter"
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#ECECEC"
                  mb={3}
                  size={"md"}
                  onChange={(e) => setQuarter(e.target.value)}
                >
                  <option value={1}>1st Quarter</option>
                  <option value={2}>2nd Quarter</option>
                  <option value={3}>3rd Quarter</option>
                  <option value={4}>4th Quarter</option>
                </Select>
              </FormControl>
              <FormControl id="date" isRequired>
                <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                  Date
                </FormLabel>
                <Input
                  type="date"
                  value={date}
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#ECECEC"
                  mb={3}
                  size={"md"}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FormControl>
            </HStack>
            <br />
            <Accordion allowToggle>
              <AccordionItem borderColor="purple.300">
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Guidelines
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel outlineColor={"#331E38"} pb={4}>
                  <div>
                    Here are some quick tips for effective bullet points:
                  </div>
                  <div>Tip 1: This is a tip</div>
                  <div>Tip 2: This is another time</div>
                  <div>Tip 3: Still another tip</div>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <br />
            <VStack>
              <FormControl id="report" isRequired>
                <Textarea
                  placeholder="What would you like to report?"
                  type="text"
                  varient="outline"
                  maxLength={500}
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#ECECEC"
                  mb={3}
                  size={"md"}
                  width={{ base: "100%", md: "lg" }}
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                />
              </FormControl>
            </VStack>
          </div>
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
        </VStack>
      </Card>
    </>
  );
}
