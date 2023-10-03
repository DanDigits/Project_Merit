import React from "react";
import { Text, Button, Spacer, VStack, SimpleGrid } from "@chakra-ui/react";

// from westc on Github
// https://gist.github.com/westc/55314af02bc5a5551f3cb64fb5c07c93
function fiscalYear(date, opt_monthStart /* default: 9 (October) */) {
  opt_monthStart = opt_monthStart == undefined ? 9 : opt_monthStart;
  var month = date.getMonth(),
    year = date.getFullYear(),
    yearOffset = Math.floor((month - (opt_monthStart % 12 || 12)) / 12) + 1;
  return yearOffset + year;
}

function fiscalQuarter(date, opt_monthStart /* default: 9 (October) */) {
  opt_monthStart = opt_monthStart == undefined ? 9 : opt_monthStart;
  var month = date.getMonth(),
    monthIndex = (month - opt_monthStart + 12) % 12;
  return ~~(monthIndex / 3) + 1;
}
// end

const DateFilter = ({ columnFilters, setColumnFilters }) => {
  const onFilterChange = (id, value) => {
    console.log("onchange", id, value);
    setColumnFilters((prev) =>
      prev.filter((f) => f.id !== id).concat({ id, value })
    );
  };

  const date = columnFilters.find((f) => f.id === "date")?.value || "";

  // get Current Date
  var currentDate = new Date();
  const offset = currentDate.getTimezoneOffset();
  currentDate = new Date(currentDate.getTime() - offset * 60 * 1000);
  var cDFormatted = currentDate.toISOString().split("T")[0];

  // get Beginning of Current Fiscal Year
  var getfiscalYear = fiscalYear(currentDate, 9);
  var fiscalDate = new Date(getfiscalYear - 1 + "-" + "10" + "-" + "01");
  fiscalDate = fiscalDate.toISOString().split("T")[0];

  // calculations for quarter and year
  var quarterStart = ["10", "01", "04", "07"];
  var getfiscalQ = fiscalQuarter(currentDate, 9);
  var quarterYear = getfiscalQ == 1 ? getfiscalYear - 1 : getfiscalYear;
  var m = String(quarterStart[getfiscalQ - 1]);

  // get beginning of Current Fiscal Quarter
  var fiscalQDate = new Date(quarterYear + "-" + m + "-" + "01");
  fiscalQDate = fiscalQDate.toISOString().split("T")[0];

  // get date 30 days previous
  var minusThirty = new Date();
  minusThirty.setDate(currentDate.getDate() - 30);
  minusThirty = minusThirty.toISOString().split("T")[0];

  return (
    <>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <VStack align={"left"}>
          <Spacer />
          <Button
            variant={"filter"}
            onClick={() => onFilterChange("date", [fiscalDate, cDFormatted])}
          >
            Current Fiscal Year
          </Button>

          <Button
            variant={"filter"}
            onClick={() => onFilterChange("date", [fiscalQDate, cDFormatted])}
          >
            Current Fiscal Quarter
          </Button>

          <Button
            variant={"filter"}
            onClick={() => onFilterChange("date", [minusThirty, cDFormatted])}
          >
            Last 30 days
          </Button>
        </VStack>
        <VStack align={"left"}>
          <Text>Custom Date Range: </Text>
          <input
            type="date"
            onChange={(e) =>
              onFilterChange("date", [e.target.value, date?.[1]])
            }
          />
          <Text> to </Text>
          <input
            type="date"
            onChange={(e) =>
              onFilterChange("date", [date?.[0], e.target.value])
            }
          />
          <Button
            variant={"filter"}
            onClick={() => onFilterChange("date", [null, null])}
          >
            Reset Date Filter
          </Button>
        </VStack>
      </SimpleGrid>
    </>
  );
};

export default DateFilter;
