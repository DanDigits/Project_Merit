"use client";
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Heading,
  Link,
  VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import User from "../ViewUser/user";

export default function Page() {
  const { data: session } = useSession();
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
          <Heading color="#331E38">Create User</Heading>
          <br />

          {User(mode)}
          <ButtonGroup>
            <Link href="/Admin/Users">
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
              form="user-form"
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
