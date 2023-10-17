/* eslint-disable no-undef */
import React from "react";
import { Box, Text, Stack, VStack, SimpleGrid } from "@chakra-ui/react";
import RoleFilter from "./RoleFilter";
import GroupFilter from "./GroupFilter";

const Filters = ({ columnFilters, setColumnFilters }) => {
  return (
    <Box bgColor={"blue.100"} p={2} mb={10}>
      <Text fontWeight={"bold"} mb={2}>
        Filter By:
      </Text>
      <SimpleGrid columns={{ base: 1, lg: 1 }} spacing={6}>
        <VStack pr={{ lg: 4 }} align={"left"}>
          <Text fontWeight={"semibold"}>Role</Text>
          <RoleFilter
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        </VStack>
        <VStack display={"none"} pr={{ lg: 4 }} align={"left"}>
          <Text fontWeight={"semibold"}>Group</Text>
          <GroupFilter
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default Filters;
