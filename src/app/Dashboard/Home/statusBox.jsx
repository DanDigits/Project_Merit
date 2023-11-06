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
  PiHandCoinsDuotone,
  PiUsersThreeDuotone,
  PiChartLineUpDuotone,
  PiCheckCircleDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

const StatusBox = ({ content }) => {
  const { category, shorten, total, needed } = content;
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
                  shorten === "mission"
                    ? PiClipboardTextDuotone
                    : shorten === "leadership"
                    ? PiUsersThreeDuotone
                    : shorten === "resources"
                    ? PiHandCoinsDuotone
                    : PiChartLineUpDuotone
                }
              />
              <Text
                fontSize={{ base: "smaller", md: "lg" }}
                fontWeight={"bold"}
                color={"black"}
              >
                {category}
              </Text>
            </HStack>
            <Icon
              boxSize={{ base: "5", md: "10" }}
              color={complete ? "#688E26" : "#E05260"}
              as={complete ? PiCheckCircleDuotone : PiXCircleDuotone}
            />
          </HStack>
        </CardHeader>
        <CardBody alignContent={"left"} mt="-6">
          <HStack align={"baseline"}>
            <Text
              ms={{ base: 1, md: 3 }}
              //fontWeight={{ base: "semibold", md: "normal" }}
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
