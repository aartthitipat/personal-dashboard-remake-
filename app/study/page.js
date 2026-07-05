import StudyView from "@/components/StudyView";
import { getHistory as getResearcherHistory } from "@/lib/researcher";
import { getHistory as getDebaterHistory } from "@/lib/debater";
import { getHistory as getTeacherHistory } from "@/lib/teacher";

export const dynamic = "force-dynamic";

const MEMBERS = [
  {
    key: "researcher",
    name: "hee",
    role: "Web Researcher",
    tagline: "Finds real answers with live web search and cites its sources.",
  },
  {
    key: "debater",
    name: "kuy",
    role: "Debater",
    tagline: "Tell it a topic and which side to argue — it argues back.",
  },
  {
    key: "teacher",
    name: "tad",
    role: "Teacher",
    tagline: "Explains anything simply — no jargon, straight to the point.",
  },
];

export default async function StudyPage() {
  const histories = {
    researcher: getResearcherHistory(),
    debater: getDebaterHistory(),
    teacher: getTeacherHistory(),
  };

  return <StudyView members={MEMBERS} histories={histories} />;
}
