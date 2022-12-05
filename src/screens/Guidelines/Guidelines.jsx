import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Center,
} from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

import NavBar from "../../components/NavBar/NavBar";
import InfoBox from "src/components/InfoBox";

const infoDos = {
  title: "II. Do:",
  paragraphContent: " ",
  listContent: [
    "Be honest on the report",
    "Take your time",
    "Use action-oriented, hard-hitting impact statements",
    "Get to the point",
    "Quantify results",
    "Fill up the entire form",
    "Stay within your scope",
    "Use bullet format",
    "Spell out uncommon acronyms the first time you use them",
    "Abbreviate words like gov't for goverment in the interest of space",
    "Be error free (no misspellings, no extra spaces, correct capitalization",
    "Review previous reports, PIF, and UIF if applicable",
  ],
};

const infoDonts = {
  title: "III. Don't:",
  paragraphContent: " ",
  listContent: [
    "Use prohibited statements",
    "Include additional duties unless focused toward the mission",
    "Use terminology only your organization understands",
    "Leave white space, unless, of course, you're trying to send a negative message",
    "Put your credibility on the line (don't rate everyone #1 if they aren't)",
    "Use 'all caps' for emphasis",
    "Use periods after bullets",
    "Use more than one exclamation in a row",
    "Use 'fluffy' statements with no meat behind them",
  ],
};
const infoWordChoice1 = {
  title: "IV. Good Words to Use:",
  paragraphContent: "Use vivid words to emphasize action and results",
  listContent: [
    "Cut",
    "Saved",
    "Created",
    "Drove",
    "Guaranteed",
    "Infuseed",
    "Led",
    "Spearheaded",
    "Developed",
    "Deftly",
    "Diplomatically",
    "Energetic",
    "Rapidly",
    "Persuasive",
    "Dynamic",
    "Instituted",
  ],
};

const infoWordChoice2 = {
  title: "V. Mundane Words:",
  paragraphContent: "Mundane words should be avoided as they are unspecific",
  listContent: [
    "Capable",
    "Dependable",
    "Effective",
    "Coordinated",
    "Sturdy",
    "Monitored",
    "Assisted",
    "Aided",
    "Contributed",
    "Employed",
    "Ready",
    "Pontential",
    "Participated",
    "Reviewed",
    "Adequate",
    "Fine",
    "Maintained",
  ],
};

const infoBasics = {
  title: "I. The Basics",
  paragraphContent: " ",
  listContent: [
    "Review the ratee's previous performance reports",
    "Gather input from the ratee in advance",
    "Don't use prohibited statements (see section xx)",
    "Take the time to write a quality report",
    "Proofread your product",
    "Follow the do's and don'ts",
    "Use strong word choice",
    "Provide context",
    "Stratify your descriptions",
    "Use common acronyms instead of writing them out",
  ],
};

const oprFundamentals = {
  title: "I. Fundamentals",
  paragraphContent: " ",
  listContent: [
    "Think ahead (ex. keep a log of the ratee's accomplishments throughout the period)",
    "Take time to write a good report",
    "Write and proofread in private",
    "Do not discuss ratings with the ratee before the report is on record",
    "Do not overrate",
    "Avoid highlighting a single, non-severe incident",
    "Do not underrate in order to show improvement in later performance reports",
    "Before writing, determine which promotion category the person fits",
    "Use of a 'promote' statement sends a strong statement -- use it wisely",
    "Avoid nicknames, calls signs, or code names",
  ],
};

const oprWritingTips = {
  title: "II. Writing Tips",
  paragraphContent: " ",
  listContent: [
    "Did the member initiate, develop, implement, and follow through with a new plan, project, or program?",
    "Did the member chair any meetings, committees, or subcommittees related to duty performance?",
    "Did the individual volunteer for any projects, additional duties, community involvement, or extracurricular activities?",
    "What recognition (awards, letters of appreciation, etc.) did the individual recieve?",
    "How did the individual save money, time, or resources in the office?",
    "What type of leader, both on and off duty, is the individual?",
  ],
};

export default function Guidelines() {
  return (
    <div>
      <NavBar />
      <Box backgroundColor="blue">
        <Tabs variant="solid-rounded" size="md">
          <Center>
            <TabList m="1em" spacing={10}>
              <Tab
                backgroundColor="lightblue"
                mx="1em"
                _selected={{ color: "white", bg: "darkblue" }}
              >
                General
              </Tab>
              <Tab
                backgroundColor="lightblue"
                mx="1em"
                _selected={{ color: "white", bg: "darkblue" }}
              >
                OPR
              </Tab>
              <Tab
                backgroundColor="lightblue"
                mx="1em"
                _selected={{ color: "white", bg: "darkblue" }}
              >
                EPR
              </Tab>
              <Tab
                backgroundColor="lightblue"
                mx="1em"
                _selected={{ color: "white", bg: "darkblue" }}
              >
                Examples
              </Tab>
            </TabList>
          </Center>
          <TabPanels>
            <TabPanel>
              <VStack>
                <InfoBox content={infoBasics}></InfoBox>
                <InfoBox content={infoDos}></InfoBox>
                <InfoBox content={infoDonts}></InfoBox>
                <InfoBox content={infoWordChoice1}></InfoBox>
                <InfoBox content={infoWordChoice2}></InfoBox>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack>
                <InfoBox content={oprFundamentals}></InfoBox>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </div>
  );
}
