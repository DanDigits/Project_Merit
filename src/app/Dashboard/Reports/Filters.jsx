/* eslint-disable no-undef */
import React from "react";
import { Box, Text, Stack, VStack, SimpleGrid } from "@chakra-ui/react";
import CategoryFilter from "./CategoryFilter";
import DateFilter from "./DateFilter";

const Filters = ({ columnFilters, setColumnFilters }) => {
  return (
    <Box bgColor={"blue.100"} p={2} mb={10}>
      <Text fontWeight={"bold"} mb={2}>
        Filter By:
      </Text>
      <SimpleGrid columns={{ base: 1, lg: 1 }} spacing={6}>
        <VStack pr={{ lg: 4 }} align={"left"} w={{ lg: "50%" }}>
          <Text mb={2} fontWeight={"semibold"}>
            Category
          </Text>
          <CategoryFilter
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        </VStack>
        <Stack align={"left"}>
          <Text fontWeight={"semibold"}>Date</Text>
          <DateFilter
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        </Stack>
      </SimpleGrid>
    </Box>
  );
};

export default Filters;
