"use client";
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

import InfoBox from "./InfoBox";

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

const eprFundamentals = {
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

const eprWritingTips = {
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

const eprPromotions = {
  title: "III. Promotion Categories",
  paragraphContent: " ",
  listContent: [
    "1: Not recommended for promotion",
    "2: Not recommended for promotion at this time",
    "3: Consider for promotion",
    "4: Ready for promotion",
    "5: Ready for immediate promotion",
  ],
};

const oprFundamentals = {
  title: "I. Fundamentals",
  paragraphContent: " ",
  listContent: [
    "OPR should assess duty performance and performance reflect the leadership",
    "Do not consider previous Promotion Recomendation Form recommendations or promotion elegibility",
    "Do not consider non-work related statuses/activities",
    "Promotion recommendations are prohibited",
    "Recommendations to attend the next level of PME or next assignment are permitted",
    "Include incident(s)/negative trait(s) that warrant documentation to hold a member accountable",
  ],
};

const oprWritingTips = {
  title: "II. Writing Tips",
  paragraphContent: " ",
  listContent: [
    "Focus on duty performance",
    "Clearly illustrate both abilities and potential",
    "Record performance in dynamic terms",
    "Focus on results, not just activity",
    "Use term understood across the Air Force",
    "Focus on primary duty performance rather than additional duties",
    "Stratify statements to highlight top performers",
    "Include PME/Assignment recommendation if applicable",
  ],
};

const oprVeiledPromotion = {
  title: "III. Prohibited Promotion Statement Examples",
  paragraphContent: " ",
  listContent: [
    "Lt Col X is senior officer material",
    "Capt X has excelled in a Major's billet",
    "Major X should be a group commander now",
    "Capt X is ready for our toughest field grade jobs",
  ],
};

const eprEx = {
  title: "EPR Example",
  paragraphContent: " ",
  listContent: [
    "My #1 of 5 SNCOs--proactive leader--exemplary supervisor who led the busiest section in the division",
    "Established long-term programs to improve support to customers--stockage and issue effectiveness",
    " ratings were consistently highest in command and top 5 in Air Force throughout year--visionary manager",
    "   His team virtually eliminated out-of-stock situations for customers--herculean effort made to look easy",
    "   Led section to new heights in all process performance indicators--team continued to exceed every goal",
    "Modernized section's outdated process for tracking late products--on-time rate now at 100% for first time",
    "Devoted two nights a week of off-duty time to ensure the unit's training requirements were met--unselfish",
    "   All three of his trainees fully qualified in minimum time--significantly improved section's effectiveness",
    "Eliminated over $6 million in serviceable excess inventory in only four months as key member of quality",
    " improved team--surpassed expectations--hands-on leadership was the catalyst for the entire effort",
    "	Simultaneously reduced over $320,000 in due-in excess--greatest decrease in the division's history",
    "Model community leader--President, local food pantry--volunteered off-duty time regularly in soup kitchen",
    "Leader, motivator, skilled tactician--leads the pack--keep him in the front--promote to SMSgt now!",
  ],
};

const oprEx = {
  title: "OPR Example",
  paragraphContent: " ",
  listContent: [
    "Led efforts that resulted in historic gains for our Airmen and kept AF readiness at the forefront in congress",
    "	Spearheaded quality of life improvements--pay table reform, retirement redux repeal, significant pay raise",
    "	Garnered over $200M for new family housing, $225M for housing allowances, and increased bonuses",
    "Developed MAJCOM Top Readiness Concerns brief for OSD--provided the real story on AF readiness",
    "Guided analysis of impact of long-term contingency operations on Air Force people, budget, and equipment",
    "Protected programs vital to AF future--AF lead for C-5 engine upgrade, $200M effort--flawless execution",
    "Authored $10M budget proposal and defended to congress on the Hill--program fully funded as a result",
    "Forged DoD-wide definition of TEMPO for $100M Congressional Report on Personnel TEMPO legislation",
    "Advised CSAF on Aerospace Expeditionary Force readiness prior to deployment--impacted all AEF units",
  ],
};

export default function Page() {
  return (
    <div>
      <Box backgroundColor="white">
        <Tabs variant="solid-rounded" fontSize={{ base: "sm", md: "md" }}>
          <Center>
            <TabList m="1em" spacing={10}>
              <Tab
                fontSize={{ base: "sm", md: "md" }}
                backgroundColor="#70A0AF"
                color={"#ECECEC"}
                mx={{ base: "0.5", md: "1em" }}
                _selected={{ color: "white", bg: "#331E38" }}
              >
                General
              </Tab>
              <Tab
                fontSize={{ base: "sm", md: "md" }}
                backgroundColor="#70A0AF"
                color={"#ECECEC"}
                mx={{ base: "0.5", md: "1em" }}
                _selected={{ color: "white", bg: "#331E38" }}
              >
                OPR
              </Tab>
              <Tab
                fontSize={{ base: "sm", md: "md" }}
                backgroundColor="#70A0AF"
                color={"#ECECEC"}
                mx={{ base: "0.5", md: "1em" }}
                _selected={{ color: "white", bg: "#331E38" }}
              >
                EPR
              </Tab>
              <Tab
                fontSize={{ base: "sm", md: "md" }}
                backgroundColor="#70A0AF"
                color={"#ECECEC"}
                mx={{ base: "0.5", md: "1em" }}
                _selected={{ color: "white", bg: "#331E38" }}
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
                <InfoBox content={oprWritingTips}></InfoBox>
                <InfoBox content={oprVeiledPromotion}></InfoBox>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack>
                <InfoBox content={eprFundamentals}></InfoBox>
                <InfoBox content={eprWritingTips}></InfoBox>
                <InfoBox content={eprPromotions}></InfoBox>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack>
                <InfoBox content={eprEx}></InfoBox>
                <InfoBox content={oprEx}></InfoBox>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </div>
  );
}
