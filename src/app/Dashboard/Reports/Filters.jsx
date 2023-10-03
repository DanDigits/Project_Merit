/* eslint-disable no-undef */
import React from "react";
import {
  Box,
  Text,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import FilterPopover from "./FilterPopover";

const Filters = ({ columnFilters, setColumnFilters }) => {
  return (
    <Box bgColor={"blue.100"} p={2} mb={10}>
      <Text mb={2}>Filter By:</Text>
      <Text>Category</Text>
      <FilterPopover
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      <Text>Date</Text>
      <HStack>
        <Text>Custom: </Text>
        <input type="date" />
        <Text> to </Text>
        <input type="date" />
        <Button size={"sm"}>Submit</Button>
      </HStack>
    </Box>
  );
};

export default Filters;

/*
const title = columnFilters.find((f) => f.id === "title")?.value || "";

  const onFilterChange = (id, value) =>
    setColumnFilters((prev) =>
      prev.filter((f) => f.id !== id).concat({ id, value })
    );
    return(
<InputGroup size={"sm"} maxW={"md"}>
        <InputLeftElement pointerEvents={"none"}>
          <Icon as={SearchIcon} />
        </InputLeftElement>
        <Input
          type="text"
          variant="input"
          placeholder="search titles.."
          value={title}
          onChange={(e) => onFilterChange("title", e.target.value)}
        />
      </InputGroup>)
*/
