import {
  Card,
  CardHeader,
  CardBody,
  Text,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  PiClipboardTextDuotone,
  PiBarbellDuotone,
  PiUsersThreeDuotone,
  PiSealCheckDuotone,
  PiCheckCircleDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

const StatusBox = ({ content, icon }) => {
  const { catagory, shorten, total, needed } = content;
  var complete;

  if (needed <= total) {
    complete = true;
  } else complete = false;

  return (
    <>
      <Card
        bg={complete ? "#f1f7f1" : "#fceaeb"}
        boxShadow={
          complete
            ? "0 0px 8px 0px rgb(112 174 110 / 85%)"
            : "0 0px 8px 0px rgb(223 41 53 / 85%)"
        }
        size={"sm"}
        variant={"outline"}
      >
        <CardHeader>
          <HStack justify={"space-between"}>
            <HStack>
              <Icon
                boxSize={{ base: "6", md: "9" }}
                as={
                  shorten === "duties"
                    ? PiClipboardTextDuotone
                    : shorten === "teamwork"
                    ? PiUsersThreeDuotone
                    : shorten === "training"
                    ? PiBarbellDuotone
                    : PiSealCheckDuotone
                }
              />
              <Text
                fontSize={{ base: "smaller", md: "lg" }}
                fontWeight={"bold"}
                color={"black"}
              >
                {catagory}
              </Text>
            </HStack>
            <Icon
              boxSize={{ base: "4", md: "6" }}
              as={complete ? PiCheckCircleDuotone : PiXCircleDuotone}
            />
          </HStack>
        </CardHeader>
        <CardBody mt="-4">
          <HStack justify={"space-between"}>
            <Text ms={3} fontSize={"3xl"} color={"black"}>
              {total}
            </Text>

            <Text color={"black"}>/ {needed} completed</Text>
          </HStack>
        </CardBody>
      </Card>
    </>
  );
};

export default StatusBox;
