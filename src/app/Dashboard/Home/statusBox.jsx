import {
  Card,
  CardHeader,
  CardBody,
  Text,
  HStack,
  Icon,
} from "@chakra-ui/react";

import {
  PiClipboardTextDuotone,
  PiBarbellDuotone,
  PiUsersThreeDuotone,
  PiSealCheckDuotone,
  PiCheckCircleDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

const StatusBox = ({ content }) => {
  const { catagory, shorten, total, needed } = content;
  var complete;

  if (needed <= total) {
    complete = true;
  } else complete = false;

  return (
    <>
      <Card
        boxShadow={
          complete
            ? "0 0px 8px 0px rgb(112 174 110 / 60%)"
            : "0 0px 8px 0px rgb(223 41 53 / 60%)"
        }
        size={"sm"}
      >
        <CardHeader>
          <HStack justify={"space-between"}>
            <HStack>
              <Icon
                display={{ base: "none", md: "initial" }}
                boxSize={"9"}
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
              boxSize={{ base: "8", md: "10" }}
              color={complete ? "#688E26" : "#E05260"}
              as={complete ? PiCheckCircleDuotone : PiXCircleDuotone}
            />
          </HStack>
        </CardHeader>
        <CardBody mt="-4">
          <HStack>
            <Text
              ms={3}
              fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
              color={"black"}
            >
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
