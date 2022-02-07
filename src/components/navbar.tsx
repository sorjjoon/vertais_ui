import { Box, Flex, Link, HStack, Button, Heading, Text, VStack, Spinner, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { Account, useCurrentUserQuery, useLogoutMutation, UserRole } from "../generated/graphql";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import router from "next/router";
import { useCurrentUser } from "./providers/userprovider";
import { useClient } from "./providers/urqlclientprovider";
import ErrorMessage from "./errormessage";
import Loading from "./utils/loading";
import CourseInfoModal from "./course/courseinfomodal";
interface navbarProps {}
export const Navbar: React.FC<navbarProps> = (props) => {
  const user = useCurrentUser();

  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const { resetClient } = useClient();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const leftLinks = (
    <HStack spacing={6} justify="left" h="100%">
      <NextLink href="/">
        <Link>
          <Heading id="title-link" as="h4" size="md">
            Vertais.fi
          </Heading>
        </Link>
      </NextLink>

      {user ? (
        <NextLink href={"/my"}>
          <Link>Kurssini</Link>
        </NextLink>
      ) : null}
    </HStack>
  );
  let rightLinks;
  if (!user) {
    //user is not logged in
    rightLinks = (
      <HStack spacing={2} h="100%">
        <NextLink href="/login" passHref>
          <Link>Kirjaudu sisään</Link>
        </NextLink>
        <NextLink href="/register" passHref>
          <Link> Rekisteröidy</Link>
        </NextLink>
      </HStack>
    );
  } else {
    rightLinks = (
      <Box bg="inherit">
        <Menu preventOverflow strategy="fixed">
          <MenuButton
            as={Button}
            bg="inherit"
            rightIcon={<ChevronDownIcon />}
            _focus={{
              boxShadow: "none",
              bg: "inherit",
            }}
            _active={{ bg: "inherit" }}
            _hover={{ bg: "inherit", textDecoration: "underline" }}
          >
            Hei, {user.username}!
          </MenuButton>
          <MenuList color="blackAlpha.900">
            {user.role == UserRole.Teacher ? (
              <MenuItem onClick={onOpen}>
                Luo uusi kurssi
                <CourseInfoModal isOpen={isOpen} onClose={onClose} />
              </MenuItem>
            ) : null}
            <MenuItem onClick={() => router.push("/view/user")}>Käyttäjätiedot</MenuItem>
            <MenuItem
              onClick={() => {
                logout().then(() => {
                  resetClient();

                  router.push("/", undefined, { shallow: false });
                });
              }}
            >
              {logoutFetching ? <Spinner /> : "Kirjaudu ulos"}
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    );
  }

  return (
    <Flex
      w="100%"
      maxW="100vw"
      top={0}
      zIndex={1}
      position="sticky"
      id="nav"
      bg="mainColor.30"
      color="white"
      minH="4em"
      mb={8}
      py={4}
      px={0}
      mx={0}
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
    >
      <Box id="navLeft" ml="var(--base-margin)" overflow="visible" bg="inherit">
        {leftLinks}
      </Box>
      <Box flex={1}> </Box>
      <Box id="navRight" mr="var(--base-margin)" overflow="visible" bg="inherit">
        <Loading isLoading={user === undefined}>{rightLinks}</Loading>
      </Box>
    </Flex>
  );
};

export default Navbar;
