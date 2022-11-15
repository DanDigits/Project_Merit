import {
  VStack,
  Center,
  Text,
  Input,
  Tabs,
  TabList,
  Tab,
  Textarea,
  Button,
  Box,
  Grid,
  GridItem,
  ListItem,
  UnorderedList,
  Select,
} from "@chakra-ui/react";
import NavBar from "../../components/NavBar";
import { useState } from "react";

import { createReport } from "../../actions/Report";
import { getSession } from "next-auth/react";

export default function Home() {
  const [name, setName] = useState("");
  const [quarter, setQuarter] = useState(0);
  const [year, setYear] = useState(0);
  const [data, setReportText] = useState("");

  const handleSubmit = async () => {
    const date_of_creation = new Date().toLocaleDateString();
    const session = await getSession();
    createReport({
      name,
      userEmail: session.user.email,
      date_of_creation,
      quarter,
      year,
      data,
    }).then((res) => {
      alert("Successfully created report with id: " + res._id);
    });
  };

  return (
    <div>
      <NavBar />
      <VStack backgroundColor="blue">
        <Box h="10"></Box>
        <Center>
          <Text color="white">Personnel Name:</Text>
          <Box w="10"></Box>
          <Input
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Box w="20"></Box>
          <Text color="white">Quarter:</Text>
          <Box w="10"></Box>
          <Select
            placeholder="Select Quarter"
            isRequired={true}
            onChange={(event) => setQuarter(event.target.value)}
          >
            <option value="1">Q1</option>
            <option value="2">Q2</option>
            <option value="3">Q3</option>
            <option value="4">Q4</option>
          </Select>
          <Box w="20"></Box>
          <Text color="white">Year:</Text>
          <Box w="10"></Box>
          <Input
            placeholder="Year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
        </Center>

        <Tabs variant="solid-rounded">
          <TabList mb="1em">
            <Tab>OPR</Tab>
            <Tab>EPR</Tab>
          </TabList>
        </Tabs>

        <Textarea
          backgroundColor="lightblue"
          w="80vw"
          h="40vh"
          value={data}
          onChange={(event) => setReportText(event.target.value)}
        />
        <Center>
          <Button m="1em">Check</Button>
          <Button m="1em" onClick={handleSubmit}>
            Export
          </Button>
        </Center>

        <Grid
          templateAreas={`"header1 header2"
                  "guidelines abbr"`}
          gridTemplateRows={"30px 300px"}
          gridTemplateColumns={"500px 500px"}
          h="200px"
          gap="3"
          color="white"
          fontWeight="bold"
        >
          <GridItem pl="5" bg="blue.300" area={"header1"}>
            Basic Guidelines
          </GridItem>
          <GridItem pl="5" bg="blue.300" area={"header2"}>
            Automatic Abbreviations
          </GridItem>
          <GridItem pl="5" color="blue.300" area={"guidelines"}>
            <UnorderedList>
              <ListItem>Format: what;how;impact </ListItem>
              <ListItem>Use action-oriented verbs</ListItem>
              <ListItem>Use sub-bullets if needed</ListItem>
              <ListItem>Use the whole line</ListItem>
              <ListItem>Do not go over 1 line per bullet</ListItem>
              <ListItem>
                Visit the Guidelines page for more information
              </ListItem>
            </UnorderedList>
          </GridItem>
          <GridItem pl="5" bg="blue.300" area={"abbr"}>
            <UnorderedList>
              <ListItem>b/c: because </ListItem>
              <ListItem>w/: with</ListItem>
              <ListItem>w/out: without</ListItem>
              <ListItem>dept: department</ListItem>
              <ListItem>op: operation</ListItem>
            </UnorderedList>
            <Button m="1em" colorScheme="gray">
              Add
            </Button>
          </GridItem>
        </Grid>
      </VStack>
    </div>
  );
}
