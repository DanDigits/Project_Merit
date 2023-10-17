/* eslint-disable no-undef */
import React from "react";
import { Select } from "@chakra-ui/react";

const options = ["Supervisor", "User"];

const RoleFilter = ({ columnFilters, setColumnFilters }) => {
  const onChange = (id, value) => {
    console.log("context", value);
    setColumnFilters((prev) => {
      const roles = prev.find((filter) => filter.id === "role")?.value;

      return prev.concat({
        id: "role",
        value: value,
      });
    });
  };

  return (
    <Select
      size={"md"}
      w={"md"}
      bgColor="white"
      onChange={(e) => {
        console.log(e.target.value);
        onChange("role", e.target.value || "");
      }}
    >
      <option value="">Select</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </Select>
  );
};

export default RoleFilter;
