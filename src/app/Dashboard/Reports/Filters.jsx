/* eslint-disable no-undef */
import React from "react";
import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import FilterPopover from "./FilterPopover";

const Filters = ({ columnFilters, setColumnFilters }) => {
  const title = columnFilters.find((f) => f.id === "title")?.value || "";

  const onFilterChange = (id, value) =>
    setColumnFilters((prev) =>
      prev.filter((f) => f.id !== id).concat({ id, value })
    );

  return (
    <Box>
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
      </InputGroup>
      <FilterPopover
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </Box>
  );
};

export default Filters;
