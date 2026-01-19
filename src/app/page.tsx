import Button from "@mui/material/Button";

import missionData from "@/data/missionData.json";
import type { MissionDataFile } from "@/types/mission";
import ExplorerLayout from "@/components/explorer/ExplorerLayout";

const data = missionData as MissionDataFile;

export default function Page() {
  return <ExplorerLayout missions={data.missions} />;
}


