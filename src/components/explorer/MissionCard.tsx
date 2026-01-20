"use client";

import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Divider,
    IconButton,
    Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import type { Mission } from "@/types/mission";

type Props = {
    mission: Mission;
    onOpen: (id: string) => void;

    isFavorited: boolean;
    onToggleFavorite: (id: string) => void;
};

// Determine chip color based on mission status
function statusChipColor(
    status: string
): "success" | "error" | "info" | "default" {
    const s = status.toLowerCase();
    if (s.includes("success")) return "success";
    if (s.includes("fail")) return "error";
    if (s.includes("ongoing")) return "info";
    if (s.includes("planned")) return "default";
    return "default";
}


export default function MissionCard({
    mission,
    onOpen,
    isFavorited,
    onToggleFavorite,
}: Props) {
    const handleOpen = () => onOpen(mission.id);

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 1.5,
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                overflow: "hidden",
                transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 6,
                    borderColor: "text.secondary",
                },
                "&:hover .seeDetailsHint": {
                    opacity: 1,
                    transform: "translateY(0px)",
                },
                "@keyframes favPop": {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.25)" },
                    "100%": { transform: "scale(1)" },
                },
            }}
        >
            <CardActionArea
                component="div"
                role="button"
                tabIndex={0}
                aria-label={`Open details for ${mission.name}`}
                onClick={handleOpen}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleOpen();
                    }
                }}
                sx={{
                    borderRadius: 3,
                    height: "100%",
                    display: "block",
                    cursor: "pointer",
                    "& .MuiCardActionArea-focusHighlight": {
                        borderRadius: 1.5,
                    },
                }}            >
                <CardContent sx={{ p: 2.5 }}>
                    {/* Top row: status + favorite */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Chip
                            size="small"

                            label={mission.status.toUpperCase()}
                            color={statusChipColor(mission.status)}
                            sx={{ fontWeight: 700, letterSpacing: 0.3 }}
                        />

                        <IconButton
                            size="small"
                            aria-label={isFavorited ? "Favorited" : "Not favorited"}
                            onClick={(e) => e.stopPropagation()}
                            disabled
                            sx={{
                                color: isFavorited ? "error.main" : "text.secondary",
                                opacity: isFavorited ? 1 : 0.5,
                            }}
                        >
                            {isFavorited && (
                                <FavoriteIcon fontSize="small" sx={{ color: "primary.main" }} />
                            )}
                        </IconButton>
                    </Box>

                    {/* Title */}
                    <Typography variant="h5" sx={{ mt: 2, fontWeight: 800 }}>
                        {mission.name}
                    </Typography>

                    {/* Subtitle */}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 600 }}>
                        Agency: {mission.agency}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* Bottom row,  */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        {/* Mission type and year */}
                        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.6 }}>
                            {mission.missionType.toUpperCase()} • {mission.year}
                        </Typography>

                        {/* See details hint button */}
                        <Box
                            className="seeDetailsHint"
                            sx={{
                                color: "text.secondary",
                                userSelect: "none",
                                opacity: { xs: 1, md: 0 },
                                transform: { xs: "none", md: "translateY(2px)" },
                                transition: "opacity 160ms ease, transform 160ms ease",
                            }}
                        >
                            <Typography variant="caption" sx={{ fontWeight: 800 }}>
                                See details
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
