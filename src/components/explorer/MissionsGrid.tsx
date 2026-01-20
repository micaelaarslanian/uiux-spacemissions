import { Box } from "@mui/material";
import type { Mission } from "@/types/mission";
import MissionCard from "./MissionCard";

type Props = {
    missions: Mission[];
    onOpenMission: (id: string) => void;

    isFavorited: (id: string) => boolean;
    onToggleFavorite: (id: string) => void;
};

export default function MissionsGrid({
    missions,
    onOpenMission,
    isFavorited,
    onToggleFavorite,
}: Props) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                },
                gap: 3,
            }}
        >
            {missions.map((m) => (
                <MissionCard
                    key={m.id}
                    mission={m}
                    onOpen={onOpenMission}
                    isFavorited={isFavorited(m.id)}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </Box>
    );
}
