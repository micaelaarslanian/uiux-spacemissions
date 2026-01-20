"use client";

import * as React from "react";

import {
    Box,
    Button,
    Chip,
    Divider,
    Slider,
    Stack,
    Typography,
    TextField,
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

    activeFilterCount: number;
    onClearAll: () => void;

};

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
    activeFilterCount,
    onClearAll,
}: Props) {
    const toggle = (value: string, list: string[], setList: (v: string[]) => void) => {
        setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
    };

    // Year input error state
    const [yearError, setYearError] = React.useState(false);


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

            <Stack spacing={3}>
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
                        Year range
                    </Typography>

                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        Leave blank for open range
                    </Typography>

                    <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                        <TextField
                            label="From"
                            value={yearRange.from ?? ""}
                            onChange={(e) => {
                                const raw = e.target.value;
                                const isNumber = raw === "" || /^\d+$/.test(raw);

                                setYearError(!isNumber);

                                if (isNumber) {
                                    onYearRangeChange({
                                        ...yearRange,
                                        from: raw === "" ? undefined : Number(raw),
                                    });
                                }
                            }}
                            error={yearError}
                            fullWidth
                        />

                        <TextField
                            label="To"
                            value={yearRange.to ?? ""}
                            onChange={(e) => {
                                const raw = e.target.value;
                                const isNumber = raw === "" || /^\d+$/.test(raw);

                                setYearError(!isNumber);

                                if (isNumber) {
                                    onYearRangeChange({
                                        ...yearRange,
                                        to: raw === "" ? undefined : Number(raw),
                                    });
                                }
                            }}
                            error={yearError}
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

                    {/* Slider */}
                    <Slider
                        value={costRange}
                        onChange={(_, v) => onCostRangeChange(v as [number, number])}
                        min={costMin}
                        max={costMax}
                        step={costStep}
                        disableSwap
                        valueLabelDisplay="off"
                    />

                    {/* Min / Max inputs */}
                    <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                        <TextField
                            label="Minimum"
                            type="number"
                            value={costRange[0]}
                            onChange={(e) => {
                                let v = Number(e.target.value);
                                if (Number.isNaN(v)) v = costMin;
                                v = Math.max(costMin, Math.min(v, costMax));
                                const next: [number, number] = [v, Math.max(v, costRange[1])];
                                onCostRangeChange(next);
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
                                v = Math.max(costMin, Math.min(v, costMax));
                                const next: [number, number] = [Math.min(v, costRange[0]), v];
                                onCostRangeChange(next);
                            }}
                            fullWidth
                        />
                    </Stack>


                </Box>
            </Stack>
        </Box>
    );
}
