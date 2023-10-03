/* eslint-disable no-undef */
import React from "react";
import Select from "react-select";

const options = [
  { id: "Training", text: "Training" },
  { id: "Conduct", text: "Conduct" },
  { id: "Teamwork", text: "Teamwork" },
  { id: "Duties", text: "Duties" },
];

const styles = {
  container: (base) => ({
    ...base,
    display: "inline-block",
    width: "250px",
    minHeight: "1px",
    textAlign: "left",
    border: "none",
  }),
  control: (base) => ({
    ...base,
    width: "250px",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  clearIndicator: (base) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
  }),
};

const FilterPopover = ({ columnFilters, setColumnFilters }) => {
  const filterCategories =
    columnFilters.find((f) => f.id === "category")?.value || [];

  var temp;
  const onChange = (value, context) => {
    //console.log(context);

    if (context.action === "select-option") {
      //console.log(context.option.id);
      temp = context.option.id;
    }
    if (context.action === "remove-value") {
      //console.log(context.removedValue.id);
      temp = context.removedValue.id;
    }

    setColumnFilters((prev) => {
      const categories = prev.find((filter) => filter.id === "category")?.value;
      //console.log("categories", categories);
      /*if (context.action === "clear") {
        console.log("clear", filterCategories);
        return ???
      }*/
      if (categories == [] || !categories) {
        //console.log("empty", temp);
        return prev.concat({
          id: "category",
          value: [temp],
        });
      }
      //console.log("add/sub", temp);
      return prev.map((f) =>
        f.id === "category"
          ? {
              ...f,
              value: filterCategories.includes(temp)
                ? categories.filter((s) => s !== temp)
                : categories.concat(temp),
            }
          : f
      );
    });
  };

  return (
    <Select
      instanceId="categoryType"
      isMulti
      isClearable={false}
      options={options}
      getOptionLabel={(option) => option.text}
      getOptionValue={(option) => option.text}
      onChange={onChange}
      styles={styles}
    />
  );
};

export default FilterPopover;
