"use client";
import React, { useState } from "react";
import {
  Card,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
} from "@chakra-ui/react";

export default function Thesaurus() {
  const [word, setWord] = useState("");
  const [results, setResults] = useState("");

  const handleSubmitInfo = (e) => {
    e.preventDefault();

    setResults("");
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
        <form
          className="flex"
          id="report-form"
          onSubmit={(e) => handleSubmitInfo(e)}
        >
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

          <VStack>
            <FormControl id="results" isReadOnly>
              <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                Results
              </FormLabel>
              <Textarea
                boxShadow={"inner"}
                type="text"
                varient="outline"
                maxLength={500}
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#EDF2F7"
                mb={3}
                size={"md"}
                width={{ base: "100%", md: "lg" }}
                value={results}
              />
            </FormControl>
          </VStack>
        </form>
      </Card>
    </>
  );
}
