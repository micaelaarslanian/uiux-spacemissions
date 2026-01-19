"use client";

import * as React from "react";
import {
    Box,
    Chip,
    Dialog,
    DialogContent,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import type { Mission } from "@/types/mission";

type Props = {
    open: boolean;
    mission: Mission | null;
    onClose: () => void;

    hasPrev: boolean;
    hasNext: boolean;
    onPrev: () => void;
    onNext: () => void;
};

function statusChipColor(status: string): "success" | "error" | "default" {
    const s = status.toLowerCase();
    if (s.includes("success")) return "success";
    if (s.includes("fail")) return "error";
    return "default";
}

function formatLaunchDate(iso: string) {
    //  "YYYY-MM-DD" -> "MM/DD/YYYY"
    const [y, m, d] = iso.split("-");
    if (!y || !m || !d) return iso;
    return `${m}/${d}/${y}`;
}

export default function MissionDetailsDialog({
    open,
    mission,
    onClose,
    hasPrev,
    hasNext,
    onPrev,
    onNext,
}: Props) {
    React.useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" && hasPrev) onPrev();
            if (e.key === "ArrowRight" && hasNext) onNext();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, hasPrev, hasNext, onPrev, onNext]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    border: 1,
                    borderColor: "divider",
                },
            }}
        >
            <Box sx={{ position: "relative" }}>
                {/* Close button */}
                <IconButton
                    onClick={onClose}
                    aria-label="Close details"
                    sx={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Scrollable content */}
                {!mission ? null : (
                    <Box sx={{ p: 3, pb: 10 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
                            <Chip
                                size="small"
                                label={mission.status.toUpperCase()}
                                color={statusChipColor(mission.status)}
                                sx={{ fontWeight: 800 }}
                            />
                        </Stack>

                        <Typography variant="h4" sx={{ mt: 2, fontWeight: 900 }}>
                            {mission.name}
                        </Typography>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mt: 0.5, fontWeight: 700 }}
                        >
                            Agency: {mission.agency}
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                mt: 2,
                                fontWeight: 800,
                                letterSpacing: 0.6,
                            }}
                        >
                            {mission.missionType.toUpperCase()} • {mission.year}
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                            {mission.description}
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <DialogContent sx={{ p: 0 }}>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
                                <Stack spacing={1}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <GroupsOutlinedIcon fontSize="small" />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                            Crew
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        {mission.crew?.length ? mission.crew.join(", ") : "—"}
                                    </Typography>
                                </Stack>

                                <Stack spacing={1}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <RocketLaunchOutlinedIcon fontSize="small" />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                            Launch
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        {mission.launchDate ? formatLaunchDate(mission.launchDate) : "—"}
                                    </Typography>
                                </Stack>

                                <Stack spacing={1}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <PaidOutlinedIcon fontSize="small" />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                            Cost
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        {mission.cost ?? "—"}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </DialogContent>
                    </Box>
                )}

                {/* Sticky footer with arrows */}
                <Box
                    sx={{
                        position: "sticky",
                        bottom: 0,
                        borderTop: 1,
                        borderColor: "divider",
                        bgcolor: "transparent",
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <IconButton onClick={onPrev} disabled={!hasPrev} aria-label="Previous mission">
                        <ArrowBackIcon />
                    </IconButton>

                    {/* <Typography variant="caption" color="text.secondary">
                        Browse missions
                    </Typography> */}

                    <IconButton onClick={onNext} disabled={!hasNext} aria-label="Next mission">
                        <ArrowForwardIcon />
                    </IconButton>
                </Box>
            </Box>
        </Dialog>
    );

}
