/* eslint-disable no-undef */
import React from "react";
import { Input, InputGroup } from "@chakra-ui/react";

const GroupFilter = ({ columnFilters, setColumnFilters }) => {
  const assigned = columnFilters.find((f) => f.id === "assigned")?.value || "";

  const onFilterChange = (id, value) =>
    setColumnFilters((prev) =>
      prev.filter((f) => f.id !== id).concat({ id, value })
    );

  return (
    <InputGroup size={"sm"} maxW={"md"}>
      <Input
        type="text"
        variant="input"
        value={assigned}
        onChange={(e) => onFilterChange("assigned", e.target.value)}
      />
    </InputGroup>
  );
};

export default GroupFilter;
