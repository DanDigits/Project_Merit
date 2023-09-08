"use client";
import { Heading, Link, Card } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

export default function Page() {
  return (
    <>
      <Card
        p={2}
        alignSelf={"center"}
        size={{ base: "sm", md: "md" }}
        w={{ md: "lg" }}
        bgColor={"white"}
      >
        <Heading mt={"5"} mb={"5"}>
          Logout successful.
        </Heading>
        <Link href="/Auth/Login">
          <Button
            mb={"5"}
            bgColor={"#70A0AF"}
            color={"white"}
            _hover={{ bgColor: "#706993", color: "white" }}
          >
            Login
          </Button>
        </Link>
      </Card>
    </>
  );
}
