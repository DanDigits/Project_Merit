/* eslint-disable no-unused-vars */
"use client";
import React, { useState } from "react";
import {
  Button,
  Card,
  Input,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Textarea,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { getSynonyms } from "./../../actions/Thesaurus.js";

export default function Thesaurus() {
  const [word, setWord] = useState("");
  const [results, setResults] = useState("");

  const handleSearch = () => {
    if (word !== "") {
      var response = getSynonyms({ word });

      setResults(response);
      console.log("Results: " + { results });
    }
  };

  return (
    <>
      <br />
      <Card
        bgColor={"white"}
        size={{ base: "sm", md: "lg" }}
        variant={"outline"}
        align={"center"}
        p={5}
        boxShadow={"inner"}
      >
        <HStack>
          <FormControl id="word">
            <FormLabel mb={1} fontSize={15} color={"#331E38"}>
              Search Thesaurus
            </FormLabel>
            <Input
              boxShadow={"inner"}
              type=""
              value={word}
              maxLength={64}
              variant="login"
              borderWidth={"2px"}
              borderColor={"#70A0AF"}
              bg="#EDF2F7"
              mb={3}
              size={"md"}
              onChange={(e) => setWord(e.target.value)}
            />
          </FormControl>
          <Icon
            mt={3}
            as={BsSearch}
            color={"#706993"}
            _hover={{ color: "#331E38" }}
            boxSize={"7"}
            onClick={() => handleSearch()}
          />
        </HStack>
        <FormControl id="results" isReadOnly>
          <FormLabel mb={1} fontSize={15} color={"#331E38"}>
            Results
          </FormLabel>
          <Textarea
            boxShadow={"inner"}
            type="text"
            variant="trim"
            maxLength={500}
            borderWidth={"2px"}
            borderColor={"#70A0AF"}
            bg="#EDF2F7"
            mb={3}
            size={"md"}
            width="100%"
            value={{ results }}
          />
        </FormControl>
      </Card>
    </>
  );
}
