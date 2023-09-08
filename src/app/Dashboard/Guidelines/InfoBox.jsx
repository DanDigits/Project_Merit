import {
  Card,
  //Heading,
  UnorderedList,
  Text,
  ListItem,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
const InfoBox = ({ content }) => {
  const { title, paragraphContent, listContent } = content;

  return (
    <Card
      backgroundColor="#706993"
      p="1.5em"
      w="100%"
      color="white"
      fontSize={{ base: "sm" }}
    >
      <CardHeader
        fontSize={{ base: "md", md: "lg" }}
        fontWeight={"bold"}
        pb={"0"}
      >
        {title}
      </CardHeader>
      <CardBody>
        <Text>{paragraphContent}</Text>
        <UnorderedList fontSize={{ base: "sm", md: "md" }}>
          {listContent.map((text, index) => (
            <ListItem key={index}>
              <Text>{text}</Text>
            </ListItem>
          ))}
        </UnorderedList>
      </CardBody>
    </Card>
  );
};

export default InfoBox;
