"use client";

import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Divider,
    Typography,
} from "@mui/material";
import type { Mission } from "@/types/mission";

type Props = {
    mission: Mission;
    onOpen: (id: string) => void;
};

function statusChipColor(status: string): "success" | "error" | "default" {
    const s = status.toLowerCase();
    if (s.includes("success")) return "success";
    if (s.includes("fail")) return "error";
    return "default";
}

export default function MissionCard({ mission, onOpen }: Props) {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                overflow: "hidden",
            }}
        >
            <CardActionArea component="div"
                role="button"
                tabIndex={0}
                onClick={() => onOpen(mission.id)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onOpen(mission.id);
                    }
                }}
                sx={{ borderRadius: 3, cursor: "pointer" }}>
                <CardContent sx={{ p: 2.5 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Chip
                            size="small"
                            label={mission.status.toUpperCase()}
                            color={statusChipColor(mission.status)}
                            sx={{ fontWeight: 700, letterSpacing: 0.3 }}
                        />

                    </Box>

                    <Typography variant="h5" sx={{ mt: 2, fontWeight: 800 }}>
                        {mission.name}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5, fontWeight: 600 }}
                    >
                        Agency: {mission.agency}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.6 }}>
                        {mission.missionType.toUpperCase()} • {mission.year}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
