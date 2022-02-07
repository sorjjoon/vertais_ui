import { SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  useDisclosure,
  Divider,
  VStack,
} from "@chakra-ui/react";

import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { formatGraphQLerror, parseNumberDefaultIfNot } from "../../utils/utils";
import ErrorMessage from "../errormessage";
import Loading from "../utils/loading";
import LoginRequired from "../utils/loginrequired";
import { useCurrentCourse } from "../providers/courseprovider";
import { useCurrentUser } from "../providers/userprovider";
import CourseInfoModal from "./courseinfomodal";
import MainPanel from "./tabs/main";
import SummaryPanel from "./tabs/summary";
import TasksPanel from "./tabs/tasks";

interface coursebannerProps {
  errorMessage?: string;
  initialTab?: tabKey;
  customTabs?: Partial<Record<tabKey, JSX.Element>>;
  customTabNames?: Partial<Record<tabKey, string>>;
  namePredicate?: (data: NamePredicateArgs) => string | undefined;
}

interface NamePredicateArgs {
  defaultName: string;
  tab: tabKey;
}

type tabKey = 0 | 1 | 2;

const CourseBanner: React.FC<coursebannerProps> = ({
  errorMessage,
  initialTab,
  customTabNames,
  customTabs = {},
  namePredicate = (x) => x.defaultName,
  children,
}) => {
  const course = useCurrentCourse();
  const router = useRouter();
  const user = useCurrentUser();
  const tabNames = { 0: "Etusivu", 1: "Tehtävät", 2: "Yhteenveto", ...customTabNames };
  const defaultTab =
    initialTab ?? (parseNumberDefaultIfNot(router.query.tab, 0, (val) => tabNames[val as tabKey] != null) as tabKey);
  const [currentTab, setTab] = useState(defaultTab);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const defaultTabs = [<MainPanel />, <TasksPanel />, <SummaryPanel />];
  const canModify = course?.owner.id === user?.id;
  if (course === null) {
    return <Box>Kurssia ei löydetty, tai et ole ilmoitattunut tälle kurssille</Box>;
  } else {
    return (
      <Loading isLoading={course === undefined || user === undefined}>
        <LoginRequired>
          <Head>
            <title>
              {(() => {
                const defaultName = `${tabNames[currentTab]} - ${course?.name}`;
                return namePredicate({ tab: currentTab, defaultName }) || defaultName;
              })()}
            </title>
          </Head>

          <Box mb={4} sx={{ ">*": { my: "0.5em" } }} pos="relative">
            {canModify ? (
              <Menu preventOverflow strategy="fixed">
                <MenuButton
                  display="block"
                  bg="inherit!important"
                  transition="all 0.2s"
                  _hover={{}}
                  _expanded={{}}
                  _focus={{}}
                  as={IconButton}
                  paddingInline={0}
                  minW="max-content"
                  pos="absolute"
                  top={0}
                  right={0}
                  overflow="hidden"
                  icon={<SettingsIcon w="100%" h="100%" className="tools" maxW={5} maxH={5} />}
                ></MenuButton>
                <MenuList overflow="hidden">
                  <MenuItem onClick={onOpen}>Muokkaa</MenuItem>
                  <CourseInfoModal isOpen={isOpen} oldData={course} onClose={onClose} />
                </MenuList>
              </Menu>
            ) : null}
            <Heading alignSelf="start">{course?.name}</Heading>
            <Text>Kurssi koodi: {course?.code}</Text>
            <Text>
              Opettaja: {course?.owner.lastName}, {course?.owner.firstName}
            </Text>
            {course?.description ? (
              <Text w="100%" mt={8}>
                {course?.description}
              </Text>
            ) : null}
            <Divider my={6} />
          </Box>
          <ErrorMessage message={errorMessage}></ErrorMessage>
          <Tabs
            defaultIndex={defaultTab}
            onChange={(tab) => {
              router.push({ pathname: router.pathname, query: { ...router.query, tab } }, undefined, {
                shallow: true,
              });
              setTab(tab as 0 | 1 | 2);
            }}
          >
            <TabList mb={5}>
              <Tab>{tabNames[0]}</Tab>
              <Tab>{tabNames[1]}</Tab>
              <Tab>{tabNames[2]}</Tab>
            </TabList>

            <TabPanels sx={{ " .container>div": { my: 3 } }}>
              <TabPanel as={VStack} maxW="100vw" px={0}>
                {customTabs[0] ?? defaultTabs[0]}
              </TabPanel>
              <TabPanel as={VStack} maxW="100vw" px={0}>
                {customTabs[1] ?? defaultTabs[1]}
              </TabPanel>
              <TabPanel as={VStack} maxW="100vw" px={0}>
                {customTabs[2] ?? defaultTabs[2]}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </LoginRequired>
        {children}
      </Loading>
    );
  }
};

export default CourseBanner;
