"use client";

import * as React from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
    FormControlLabel,
    Slider,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

type YearRange = { from?: number; to?: number };

type Props = {
    missionTypes: string[];
    statuses: string[];

    costMin: number;
    costMax: number;
    costStep: number;

    selectedMissionTypes: string[];
    onSelectedMissionTypesChange: (v: string[]) => void;

    selectedStatuses: string[];
    onSelectedStatusesChange: (v: string[]) => void;

    yearRange: YearRange;
    onYearRangeChange: (v: YearRange) => void;

    costRange: [number, number];
    onCostRangeChange: (v: [number, number]) => void;

    // Favorites filter
    showFavoritesOnly: boolean;
    onShowFavoritesOnlyChange: (v: boolean) => void;
    favoritesCount: number;

    activeFilterCount: number;
    onClearAll: () => void;
};

function isDigitsOrEmpty(raw: string) {
    return raw === "" || /^\d+$/.test(raw);
}

export default function FiltersSidebar({
    missionTypes,
    statuses,
    costMin,
    costMax,
    costStep,
    selectedMissionTypes,
    onSelectedMissionTypesChange,
    selectedStatuses,
    onSelectedStatusesChange,
    yearRange,
    onYearRangeChange,
    costRange,
    onCostRangeChange,
    showFavoritesOnly,
    onShowFavoritesOnlyChange,
    favoritesCount,
    activeFilterCount,
    onClearAll,
}: Props) {
    const toggle = (value: string, list: string[], setList: (v: string[]) => void) => {
        setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
    };

    // Year input error state: only non-numeric characters
    const [yearError, setYearError] = React.useState(false);

    const handleYearChange = (key: "from" | "to") => (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const ok = isDigitsOrEmpty(raw);

        setYearError(!ok);

        if (!ok) return;

        onYearRangeChange({
            ...yearRange,
            [key]: raw === "" ? undefined : Number(raw),
        });
    };

    const clamp = (v: number) => Math.max(costMin, Math.min(v, costMax));

    return (
        <Box sx={{ p: 3 }}>
            <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    Filters
                </Typography>
                <Button onClick={onClearAll} size="small">
                    Clear all
                </Button>
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                {activeFilterCount
                    ? `${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active`
                    : "No filters active"}
            </Typography>

            {/* Favorites-only */}
            <FormControlLabel
                sx={{ mb: 2, alignItems: "center" }}
                control={
                    <Switch
                        checked={showFavoritesOnly}
                        onChange={(e) => onShowFavoritesOnlyChange(e.target.checked)}
                    />
                }
                label={
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Show Favorites Only{" "}
                        <Typography component="span" variant="body2" color="text.secondary">
                            ({favoritesCount})
                        </Typography>
                    </Typography>
                }
            />

            <Divider />


            <Stack spacing={3} sx={{ mt: 3 }}>
                {/* Mission type */}
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800 }}>
                        Mission type
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {missionTypes.map((t) => (
                            <Chip
                                key={t}
                                label={t}
                                clickable
                                onClick={() => toggle(t, selectedMissionTypes, onSelectedMissionTypesChange)}
                                variant={selectedMissionTypes.includes(t) ? "filled" : "outlined"}
                            />
                        ))}
                    </Stack>
                </Box>

                {/* Status */}
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800 }}>
                        Status
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {statuses.map((s) => (
                            <Chip
                                key={s}
                                label={s}
                                clickable
                                onClick={() => toggle(s, selectedStatuses, onSelectedStatusesChange)}
                                variant={selectedStatuses.includes(s) ? "filled" : "outlined"}
                            />
                        ))}
                    </Stack>
                </Box>

                <Divider />

                {/* Year range */}
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800 }}>
                        Year
                    </Typography>

                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        Leave blank for open range
                    </Typography>

                    <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                        <TextField
                            label="From"
                            value={yearRange.from ?? ""}
                            onChange={handleYearChange("from")}
                            error={yearError}
                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                            fullWidth
                        />
                        <TextField
                            label="To"
                            value={yearRange.to ?? ""}
                            onChange={handleYearChange("to")}
                            error={yearError}
                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                            fullWidth
                        />
                    </Stack>

                    {yearError && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                            Needs to be a year
                        </Typography>
                    )}
                </Box>

                {/* Cost */}
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 800 }}>
                        Cost
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                        Select a range
                    </Typography>

                    <Slider
                        value={costRange}
                        onChange={(_, v) => onCostRangeChange(v as [number, number])}
                        min={costMin}
                        max={costMax}
                        step={costStep}
                        disableSwap
                        valueLabelDisplay="auto"
                    />

                    <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                        <TextField
                            label="Minimum"
                            type="number"
                            value={costRange[0]}
                            onChange={(e) => {
                                let v = Number(e.target.value);
                                if (Number.isNaN(v)) v = costMin;
                                v = clamp(v);
                                onCostRangeChange([v, Math.max(v, costRange[1])]);
                            }}
                            fullWidth
                        />
                        <TextField
                            label="Maximum"
                            type="number"
                            value={costRange[1]}
                            onChange={(e) => {
                                let v = Number(e.target.value);
                                if (Number.isNaN(v)) v = costMax;
                                v = clamp(v);
                                onCostRangeChange([Math.min(v, costRange[0]), v]);
                            }}
                            fullWidth
                        />
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}
