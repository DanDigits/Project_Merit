"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { customTheme } from "../styles/customTheme";
import React from "react";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
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
  AiOutlineFile,
  AiOutlineFolder,
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
      bg={"#F4E8C1"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" m="30" justify={{ base: "space-between", md: "center" }}>
        <Icon
          my={"18"}
          as={AiOutlineFileProtect}
          color="#331E38"
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
        <NextLink href="/Dashboard/Home">
          <Button
            variant="ghost"
            onClick={onClose}
            fontSize={20}
            textColor={"#331E38"}
            colorScheme="purple"
            _hover={{ bg: "#706993", color: "white" }}
            leftIcon={<AiFillHome />}
          >
            Home
          </Button>
        </NextLink>

        <NextLink href={"/Dashboard/Reports"} passHref>
          <Button
            variant="ghost"
            onClick={onClose}
            fontSize={20}
            textColor={"#331E38"}
            colorScheme="purple"
            _hover={{ bg: "#706993", color: "white" }}
            leftIcon={<AiOutlineFolder />}
          >
            Reports
          </Button>
        </NextLink>

        <NextLink href={"/Dashboard/Guidelines"} passHref>
          <Button
            variant="ghost"
            onClick={onClose}
            fontSize={20}
            textColor={"#331E38"}
            colorScheme="purple"
            _hover={{ bg: "#706993", color: "white" }}
            leftIcon={<AiOutlineFile />}
          >
            Guidelines
          </Button>
        </NextLink>
      </VStack>
    </Box>
  );
};

/*const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white"
        }}
        {...rest}
      >
        
        {children}
      </Flex>
    </Link>
  )
}*/

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

  useEffect(() => {
    getSession().then((session) => setRank(session.user.rank));
    getSession().then((session) => setLastName(session.user.lastName));
    getSession().then((session) => setSuffix(session.user.suffix));
  }, []);

  return (
    <Flex
      boxShadow={"md"}
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={"white"}
      justifyContent={{ base: "space-between" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        color={"#706993"}
        icon={<FiMenu />}
      />
      <Box justifyContent={{ base: "space-between", md: "flex-end" }}>
        <Button
          variant="ghost"
          onClick={() => router.push("/Dashboard/NewReport")}
          fontSize={20}
          textColor={"#706993"}
          colorScheme="purple"
          _hover={{ bg: "#706993", color: "white" }}
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
            textColor={"#706993"}
            _hover={{ bg: "#706993", color: "white" }}
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
