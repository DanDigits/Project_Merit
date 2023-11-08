"use client";
import React from "react";
import { Stack, Icon, Box } from "@chakra-ui/react";
import { AiOutlineFileProtect } from "react-icons/ai";
import { ChakraProvider } from "@chakra-ui/react";
import { customTheme } from "../styles/customTheme";

export default function layoutLogin({ children }) {
  return (
    <ChakraProvider theme={customTheme}>
      <Box
        minH="100vh"
        pos="fixed"
        w={"full"}
        align={"center"}
        justify={"center"}
        bgColor={"gray.100"}
      >
        <Box h={"5"} bg={"#38a4b1"}></Box>
        <Stack overflow={"auto"} pos="fixed" h="full" w={"full"} spacing={8}>
          <Icon
            my={"12"}
            alignSelf={"center"}
            as={AiOutlineFileProtect}
            color="#031926"
            boxSize={"20"}
          />
          {children}
        </Stack>
      </Box>
    </ChakraProvider>
  );
}
