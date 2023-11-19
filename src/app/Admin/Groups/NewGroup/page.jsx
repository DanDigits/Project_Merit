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
import { useSession } from "next-auth/react";
import Group from "../ViewGroup/group";
import { useEffect } from "react";

export default function Page() {
  const { data: session } = useSession();
  const mode = "New";

  useEffect(() => {
    if (session) {
      if (session?.user.role !== "Admin" && typeof window !== "undefined") {
        window.location.replace("/Dashboard/Home");
      }
    }
  }, [session]);

  return (
    <>
      {session?.user.role == "Admin" && (
        <Card
          p={{ base: 0, md: 2 }}
          mx={{ base: -4, md: 0 }}
          alignSelf={"center"}
          size={{ base: "sm", md: "lg" }}
          w={{ md: "100%" }}
          bgColor={"white"}
        >
          <VStack m="5vh">
            <Heading color="#331E38">Create Group</Heading>
            <br />

            {Group(mode)}
            <ButtonGroup>
              <Link href="/Admin/Groups">
                <Button
                  bgColor={"#7eb67d"}
                  color={"#black"}
                  _hover={{ bgColor: "#031926", color: "white" }}
                >
                  Cancel
                </Button>
              </Link>
              <Button
                bgColor={"#6abbc4"}
                color={"black"}
                _hover={{ bgColor: "#031926", color: "white" }}
                form="group-form"
                type="submit"
              >
                Submit
              </Button>
            </ButtonGroup>
          </VStack>
        </Card>
      )}
    </>
  );
}
