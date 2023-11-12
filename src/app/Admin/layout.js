"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { customTheme } from "../styles/customTheme";
import React from "react";
import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import {
  IconButton,
  Box,
  CloseButton,
  Button,
  Flex,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import {
  AiOutlineFileProtect,
  AiFillHome,
  AiFillFile,
  AiFillFolder,
  AiOutlineFileAdd,
} from "react-icons/ai";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { signOut } from "next-auth/react";
/*const LinkItems = [
  { name: "Home", icon: AiFillHome },
  { name: "Reports", icon: AiOutlineFolder },
  { name: "Guidelines", icon: AiOutlineFile }
]*/

export default function SidebarWithHeader({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChakraProvider theme={customTheme}>
      <Box minH="100vh" bg={useColorModeValue("#F5F5F5", "#D4D4D4")}>
        <SidebarContent
          onClose={() => onClose}
          display={{ base: "none", md: "block" }}
        />
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent onClose={onClose} />
          </DrawerContent>
        </Drawer>
        {/* mobilenav */}
        <MobileNav onOpen={onOpen} />
        <Box p="4" px="8" ml={{ base: "0", md: "60" }}>
          {children}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  //const router = useRouter();
  return (
    <Box
      boxShadow={"md"}
      transition="3s ease"
      bg={"#38a4b1"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" m="30" justify={{ base: "space-between", md: "center" }}>
        <Icon
          my={"18"}
          as={AiOutlineFileProtect}
          color="#031926"
          boxSize={"14"}
        />
        <CloseButton
          alignSelf="center"
          display={{ md: "none" }}
          color="black"
          onClick={onClose}
        />
      </Flex>
      <VStack mt="50px" ml={10} spacing={14} alignItems="left" w="100%">
        <NextLink href="/Admin/Users">
          <Button
            variant="ghost"
            onClick={onClose}
            fontSize={{ base: "2xl", md: "xl" }}
            textColor={"#031926"}
            _hover={{ bg: "#1c303c", color: "white" }}
          >
            Users
          </Button>
        </NextLink>
        <NextLink href={"/Admin/Groups"} passHref>
          <Button
            variant="ghost"
            onClick={onClose}
            fontSize={{ base: "2xl", md: "xl" }}
            textColor={"#031926"}
            _hover={{ bg: "#1c303c", color: "white" }}
          >
            Groups
          </Button>
        </NextLink>
      </VStack>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  //const { data: session, status, update } = useSession();
  const router = useRouter();

  const handleLogout = (e) => {
    e.preventDefault();
    signOut({ callbackUrl: "/Auth/Logout" });
  };

  const [rank, setRank] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const { update } = useSession();

  useEffect(() => {
    getSession().then((session) => {
      setRank(session.user.rank);
      setLastName(session.user.lastName);
      setSuffix(session.user.suffix);
    });
  }, [update]);

  return (
    <Flex
      boxShadow={"md"}
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={"#031926"}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        color={"white"}
        icon={<FiMenu />}
      />
      <Box justifyContent={{ base: "space-between", md: "flex-end" }}>
        <Button
          variant="ghost"
          onClick={() => router.push("/Dashboard/NewReport")}
          fontSize={20}
          textColor={"white"}
          _hover={{ bg: "white", color: "#031926" }}
          textOverflow={"inherit"}
          leftIcon={<AiOutlineFileAdd />}
        >
          New Report
        </Button>

        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            fontSize={20}
            textColor={"white"}
            _hover={{ bg: "white", color: "#031926" }}
            leftIcon={<FaUser />}
          >
            <Text display={{ base: "none", md: "flex" }}>
              {rank} {lastName} {suffix}
            </Text>
          </MenuButton>
          <MenuList>
            <MenuItem
              textColor={"#331E38"}
              onClick={() => router.push("/Dashboard/Profile")}
            >
              Profile
            </MenuItem>
            <MenuItem textColor={"#331E38"} onClick={handleLogout}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};