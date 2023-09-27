"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@chakra-ui/react";
import { Stack, Text, VStack, HStack, Heading } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

export default function Page() {
  const [rank, setRank] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");

  useEffect(() => {
    getSession().then((session) => setRank(session.user.rank));
    getSession().then((session) => setLastName(session.user.lastName));
    getSession().then((session) => setSuffix(session.user.suffix));
  }, []);

  return (
    <>
      <Card
        p={5}
        alignSelf={"center"}
        alignItems={"center"}
        size={{ base: "sm", md: "md" }}
        w={{ md: "lg" }}
        bgColor={"white"}
      >
        <Stack>
          <Heading
            fontSize={{ base: "25px", md: "30px" }}
            color="#331E38"
            py={"5"}
          >
            Welcome {rank} {lastName} {suffix}
          </Heading>
          ;
          <Text fontSize={20} color="#331E38" py={"2"}>
            You have written...
          </Text>
          <HStack spacing={4} alignSelf={"center"}>
            <Card
              bgColor={"#A0C1B9"}
              size={{ base: "sm", md: "lg" }}
              variant={"outline"}
              align={"center"}
            >
              <CardBody>
                <VStack>
                  <Text color={"#331E38"} fontSize={30} fontWeight={"semibold"}>
                    #
                  </Text>
                  <Text color={"#331E38"}>reports for Q#</Text>
                </VStack>
              </CardBody>
            </Card>
            <Card
              bgColor={"#70A0AF"}
              size={{ base: "sm", md: "lg" }}
              variant={"outline"}
              align={"center"}
            >
              <CardBody>
                <VStack>
                  <Text color={"#331E38"} fontSize={30} fontWeight={"semibold"}>
                    #
                  </Text>
                  <Text color={"#331E38"}>reports for 2023</Text>
                </VStack>
              </CardBody>
            </Card>
          </HStack>
          <Text
            fontSize={20}
            color="#331E38"
            pt={"8"}
            pe={"5"}
            alignSelf={"center"}
          >
            Your last report was written # days ago.
          </Text>
          <Card
            bgColor={"#706993"}
            size={{ base: "sm", md: "lg" }}
            variant={"outline"}
            align={"left"}
            width={{ md: "md" }}
          >
            <CardHeader pb={"5"}>
              <Heading fontSize={"20"}>2023 Q# July 1</Heading>
            </CardHeader>
            <CardBody pt={"0"} pb={"5"}>
              <Text color={"#331E38"} fontSize={"15"} fontWeight={"semibold"}>
                Preview
              </Text>
            </CardBody>
            <CardFooter pt={"0"}>
              <Button bg="white" _hover={{ bg: "#331E38", color: "white" }}>
                View Last Report
              </Button>
            </CardFooter>
          </Card>
        </Stack>
      </Card>
    </>
  );
}
