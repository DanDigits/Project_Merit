"use client";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Center,
  Card,
  Link,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

import InfoBox from "./InfoBox";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const FoundationalChanges = {
  title: "Foundational Changes",
  paragraphContent:
    "In 2023 the USAF adopted the following changes for performance reviews:",
  listContent: [
    "COMPETENCY-BASED ASSESSMENTS: Evaluating behaviors and outcomes provides a more accurate, holistic performance assessment",
    "PERFORMANCE STATEMENTS: Narrative-style writing and plain language to describe performance; they are efficient and clear, improving the ability to understand performance",
    "MAJOR PERFORMANCE AREAS (MPA): align the duties and responsibilities of Airmen's everyday performance and/or behaviors to develop the mission-focused Airmen we need; MPA’s include Executing the Mission, Leading People, Managing Resources, and Improving the Unit",
    "AIRMAN LEADERSHIP QUALITIES (ALQ): Represent performance characteristics we want to define, develop, incentivize, and measure in our Airmen",
  ],
};

const MPAList = {
  title: "Major Performance Areas (MPAs)",
  paragraphContent:
    "There are ten Airman Leadership Qualities broken into four Major Performance Areas:",
  listContent: [
    "EXECUTING THE MISSION: Job Proficiency, Initiative, Adaptability",
    "LEADING PEOPLE: Inclusion & Teamwork, Emotional Intelligence, Communication",
    "MANAGING RESOURCES: Stewardship, Accountability",
    "IMPROVING THE UNIT: Decision Making, Innovation",
  ],
};

const MPAExecutingMission = {
  title: "MPA I. Executing the Mission",
  paragraphContent:
    "Effectively uses knowledge initiative, and adaptability to produce timely, high quality, quantity results to positively impact the mission.",
  listContent: [
    "JOB PROFICIENCY: Demonstrates knowledge and professional skill in assigned duties, achieving positive results and impact in support of the mission.",
    "INITIATIVE: Assesses and takes independent or directed action to complete a task or mission that influences the mission or organization.",
    "ADAPTABILITY: Adjusts to changing conditions, to include plans, information, processes, requirements and obstacles in accomplishing the mission.",
  ],
};

const MPALeadingPeople = {
  title: "MPA II. Leading People",
  paragraphContent:
    "Fosters cohesive teams, effectively communicates, and uses emotional intelligence to take care of people and accomplish the mission.",
  listContent: [
    "INCLUSION & TEAMWORK: Collaborates effectively with others to achieve an inclusive climate in pursuit of a common goal or to complete a task or mission.",
    "EMOTIONAL INTELLIGENCE: Exercises self-awareness, manages their own emotions effectively; demonstrates an understanding of others’ emotions, and appropriately manages relationships.",
    "COMMUNICATION: Articulates information in a clear and timely manner, both verbally and non-verbally, through active listening and messaging tailored to the appropriate audience.",
  ],
};

const MPAManagingResources = {
  title: "MPA III. Managing Resources",
  paragraphContent:
    "Manages assigned resources effectively and takes responsibility for actions, behaviors to maximize organizational performance.",
  listContent: [
    "STEWARDSHIP: Demonstrates responsible management of assigned resources, which may include time, equipment, people, funds and/or facilities.",
    "ACCOUNTABILITY: Takes responsibility for the actions and behaviors of self and/or team; demonstrates reliability and transparency.",
  ],
};

const MPAImprovingUnit = {
  title: "MPA IV. Improving the Unit",
  paragraphContent:
    "Demonstrates critical thinking and fosters innovation to find creative solutions and improve mission execution.",
  listContent: [
    "DECISION MAKING: Makes well-informed, effective and timely decisions under one’s control that weigh constraints, risks, and benefits.",
    "INNOVATION: Thinks creatively about different ways to solve problems, implements improvements and demonstrates calculated risk-taking.",
  ],
};

const CommunicatingCompetencies = {
  title: "Using Narrative-Style Performance Statements",
  listContent: [
    "The SHIFT to Performance Statements: To best communicate Airmen’s performance, the Air Force has replaced bullets with Performance Statements. Performance Statements use narrative-style writing and plain language to describe Airmen’s performance in each of the four Major Performance Areas without the need of extensive technical or contextual knowledge. Performance Statements should function as standalone sentences and include two elements: 1) the behavior or action taken by an Airman; and 2) the impact, results, or outcome of that behavior/action. If using acronyms and abbreviations, only utilize the approved Air Force Acronym and Abbreviation List, unless noted by an approved category.",
    "Adopting a QUALITY over QUANTITY Mentality: Raters are encouraged to refer to the 10 MPAs when writing Performance Statements, but should not attempt to include them all. Instead, raters should select noteworthy anecdotes that are representative of the Airman’s behaviors and achievements in the context of their position and rank. This new writing style helps shift our performance evaluation culture from the impractical attempt to synthesize an Airman’s entire performance on one page to using representative examples that best capture the essence of an Airman’s behaviors and results, whether successful or not. A coherent performance statement should identify a specific competency and describe how well it was performed in line with a given MPA (Major Performance Areas) or ALQ.",
  ],
};

const WritingPerformanceStatements = {
  title: "Writing Performance Statements",
  paragraphContent:
    "Performance Statements are the AF narrative-style of writing to communicate performance. They are efficient, increase clarity, and improve the ability to understand performance correctly and equitably. Guidance for writing Performance Statements is deliberately not overly prescriptive to enable flexibility and freedom when capturing performance.",
  listContent: [
    "Each Performance Statement will be a standalone sentence and include 1. action and 2. at least one of the following: impact or results/outcome.",
    "Performance Statements are plain language and avoid using uncommon acronyms and abbreviations.",
  ],
};

const WritingPerformanceStatementsDos = {
  title: "Do:",
  listContent: [
    "Consider writing two Performance Staments in a single MPA, aiming for each Performance Statement to be around 150-175 characters in length (max 350 characters).",
    "Include a scene (context), a person, an action, and/or a tool/instrument (the means) used to achieve that action. Any combination of these elements can craft a noteworthy narrative.",
    "Think about the scope, or range of impact, a particular behavior/skill has; and the quality, or depth/meaningfulness, of its impact.",
    "Make your narrative believable and relate to the community's prior experiences, expectations, and cultural norms to resonate with your intend audience.",
    "Consider whether an outside reader can make sense of the who, what, when, where, and why of the statement",
    "Describe Airmen’s successes and developmental needs or shortcomings. An Airman may exhibit proficiency in taking initiative and fostering innovation worthy of acknowledgement, even if their actions fall short of producing tangible results. Others may need additional support suggesting where they almost reached proficiency in an area of importance to their position and how to go about doing so.",
  ],
};

const WritingPerformanceStatementsDonts = {
  title: "Don't:",
  listContent: [
    "Use overly clichéd superlatives, over-the-top praise, or overly common descriptors, which reduces credibility and distracts from the specific story being conveyed.",
    "Include overly general or vague statements. Instead, link your feedback to the 10 ALQs and identify opportunities for future development.",
  ],
};

const NeedsImprovementEx = {
  title:
    "I. Needs Improvement Example for MPA: Executing the Mission; ALQ: Adaptability",
  paragraphContent:
    "MSgt Bailey learned a Primary Care Team member tested COVID positive, and, after being prompted, notified her Flight Commander at morning huddle, while waiting for direction on future actions to take.",
  listContent: [
    "Needs further growth to enhance understanding and/or performance.",
  ],
};

const DevelopingEx = {
  title:
    "II. Developing Example for MPA: Executing the Mission; ALQ: Adaptability",
  paragraphContent:
    "When MSgt Bailey learned a Primary Care Team member tested COVID positive, she notified her Flight Commander, and, with direction from her leadership, her team was able to determine a plan to resolve the issue.",
  listContent: ["Generally accepts new information and changing conditions"],
};

const ProficientEx = {
  title:
    "III. Proficient Example for MPA: Executing the Mission; ALQ: Adaptability",
  paragraphContent:
    "Learning a Primary Care Team member tested COVID positive, MSgt Bailey responded professionally with appropriate action adjusting the daily schedule and created a new plan ensuring team coverage.",
  listContent: [
    "Adjusts to change or ambiguity with composure to meet mission objectives",
  ],
};

const HighlyProficientEx = {
  title:
    "IV. Highly Proficient Example for MPA: Executing the Mission; ALQ: Adaptability",
  paragraphContent:
    "MSgt Bailey learned a Primary Care Team member tested COVID positive and, without prompting, empowered a SSgt as Team leader deciding on adjustments, ensuring team coverage and mission accomplishment.",
  listContent: [
    "Independently adjusts to change or ambiguity with composure; empowers others to implement changes to meet mission objectives",
  ],
};

const ExceptionallySkilledEx = {
  title:
    "V. Exceptionally Skilled Example for MPA: Executing the Mission; ALQ: Adaptability",
  paragraphContent:
    "When a Primary Care Team member tested COVID positive, MSgt Bailey independently acted to empower a SSgt as Team lead ensuring coverage, mentoring them to create/brief new plans to Medical Group for process improvement.",
  listContent: [
    "Leverages changes as an opportunity to better meet mission objectives; inspires others to be more adaptable and equips them to handle changes independently",
  ],
};

const infoWordChoice1 = {
  title: "Good Words to Use:",
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
  title: "Mundane Words:",
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

const infoWordChoice3 = {
  title: "Acceptable Abbreviations:",
  paragraphContent: (
    <Link
      fontSize={{ base: "sm", md: "md" }}
      isExternal
      href="https://www.afpc.af.mil/Career-Management/Acronyms/"
    >
      Air Force Acronym & Abbreviation List <ExternalLinkIcon mx="2px" />
    </Link>
  ),
  listContent: [],
};

export default function Page() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      if (session?.user.role === "Admin") {
        window.location.replace("/Admin/Users");
      }
    }
  }, [session]);

  return (
    <div>
      <Card
        p={{ base: 0, md: 2 }}
        mx={{ base: -4, md: 0 }}
        alignSelf={"center"}
        size={{ base: "sm", md: "lg" }}
        w={{ md: "100%" }}
        bgColor={"white"}
      >
        <Tabs variant="solid-rounded" size={{ base: "sm", md: "md" }}>
          <Center>
            <TabList m="1em" spacing={10}>
              <Tab
                fontSize={{ base: "sm", md: "md" }}
                backgroundColor="#9cd2d8"
                color={"black"}
                mx={{ base: "0.5", md: "1em" }}
                _selected={{ color: "white", bg: "#031926" }}
              >
                General
              </Tab>
              <Tab
                fontSize={{ base: "sm", md: "md" }}
                backgroundColor="#9cd2d8"
                color={"black"}
                mx={{ base: "0.5", md: "1em" }}
                _selected={{ color: "white", bg: "#031926" }}
              >
                Formatting
              </Tab>
              <Tab
                fontSize={{ base: "sm", md: "md" }}
                backgroundColor="#9cd2d8"
                color={"black"}
                mx={{ base: "0.5", md: "1em" }}
                _selected={{ color: "white", bg: "#031926" }}
              >
                Word Choices
              </Tab>
              <Tab
                fontSize={{ base: "sm", md: "md" }}
                backgroundColor="#9cd2d8"
                color={"black"}
                mx={{ base: "0.5", md: "1em" }}
                _selected={{ color: "white", bg: "#031926" }}
              >
                Examples
              </Tab>
            </TabList>
          </Center>
          <TabPanels>
            <TabPanel>
              <VStack>
                <InfoBox content={FoundationalChanges}></InfoBox>
                <InfoBox content={MPAList}></InfoBox>
                <InfoBox content={MPAExecutingMission}></InfoBox>
                <InfoBox content={MPALeadingPeople}></InfoBox>
                <InfoBox content={MPAManagingResources}></InfoBox>
                <InfoBox content={MPAImprovingUnit}></InfoBox>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack>
                <InfoBox content={CommunicatingCompetencies}></InfoBox>
                <InfoBox content={WritingPerformanceStatements}></InfoBox>
                <InfoBox content={WritingPerformanceStatementsDos}></InfoBox>
                <InfoBox content={WritingPerformanceStatementsDonts}></InfoBox>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack>
                <InfoBox content={infoWordChoice3}></InfoBox>
                <InfoBox content={infoWordChoice1}></InfoBox>
                <InfoBox content={infoWordChoice2}></InfoBox>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack>
                <InfoBox content={NeedsImprovementEx}></InfoBox>
                <InfoBox content={DevelopingEx}></InfoBox>
                <InfoBox content={ProficientEx}></InfoBox>
                <InfoBox content={HighlyProficientEx}></InfoBox>
                <InfoBox content={ExceptionallySkilledEx}></InfoBox>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>
    </div>
  );
}
