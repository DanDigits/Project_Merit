/* eslint-disable no-undef */
import React from "react";
import { Select } from "@chakra-ui/react";

const options = ["Training", "Conduct", "Teamwork", "Duties"];
const FilterPopover = ({ columnFilters, setColumnFilters }) => {
  const filterCategories =
    columnFilters.find((f) => f.id === "category")?.value || [];
  const onFilterChange = (id, value) => {
    /*setColumnFilters((prev) =>
      prev.filter((f) => f.id !== id).concat({ id, value })
    );*/
    setColumnFilters((prev) => {
      const categories = prev.find((filter) => filter.id === "category")?.value;
      if (value === "") {
        return prev.concat({
          id: "category",
          value: [],
        });
      }
      if (categories == [] || !categories) {
        return prev.concat({
          id: "category",
          value: [value],
        });
      }
      return prev.map((f) =>
        f.id === "category"
          ? {
              ...f,
              value: filterCategories.includes(value)
                ? categories.filter((s) => s !== value)
                : categories.concat(value),
            }
          : f
      );
    });
  };
  return (
    <Select
      size={"lg"}
      w={"md"}
      multiple
      bgColor="white"
      value={filterCategories}
      onChange={(e) => {
        console.log(e.target.value);
        onFilterChange("category", e.target.value || "");
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </Select>
  );
};

export default FilterPopover;
