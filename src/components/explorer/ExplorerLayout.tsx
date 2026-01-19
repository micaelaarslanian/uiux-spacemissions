"use client";

import * as React from "react";
import { Box, Button, Divider, Drawer, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import type { Mission } from "@/types/mission";
import ExplorerHeader from "./ExplorerHeader";
import ExplorerToolbar from "./ExplorerToolbar";
import FiltersSidebar from "./FiltersSidebar";
import MissionsGrid from "./MissionsGrid";
import MissionDetailsDialog from "./MissionDetailsDialog";

export type SortKey = "name_asc" | "year_asc" | "year_desc";

type Props = {
    missions: Mission[];
};

type YearRange = { from?: number; to?: number };

function uniqueSorted(values: string[]) {
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function computeMinMax(nums: number[]) {
    if (!nums.length) return { min: 0, max: 0 };
    return { min: Math.min(...nums), max: Math.max(...nums) };
}

function computeStep(min: number, max: number) {
    const range = max - min;
    if (range <= 10) return 1;
    if (range <= 50) return 5;
    if (range <= 200) return 10;
    return 25;
}

export default function ExplorerLayout({ missions }: Props) {
    // Top toolbar state
    const [missionQuery, setMissionQuery] = React.useState("");
    const [selectedAgencies, setSelectedAgencies] = React.useState<string[]>([]);
    const [sortKey, setSortKey] = React.useState<SortKey>("year_asc");

    // Sidebar filter state
    const [selectedMissionTypes, setSelectedMissionTypes] = React.useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);
    const [yearRange, setYearRange] = React.useState<YearRange>({});
    const [costRange, setCostRange] = React.useState<[number, number]>([0, 0]);

    // Mobile filters drawer
    const [filtersOpen, setFiltersOpen] = React.useState(false);

    // Options from dataset
    const agencies = React.useMemo(() => uniqueSorted(missions.map((m) => m.agency)), [missions]);
    const missionTypes = React.useMemo(
        () => uniqueSorted(missions.map((m) => m.missionType)),
        [missions]
    );
    const statuses = React.useMemo(() => uniqueSorted(missions.map((m) => m.status)), [missions]);




    // Cost min/max + step from dataset
    const costMinMax = React.useMemo(() => {
        const costs = missions
            .map((m) => m.cost)
            .filter((n): n is number => typeof n === "number" && Number.isFinite(n));
        return computeMinMax(costs);
    }, [missions]);


    const costStep = React.useMemo(
        () => computeStep(costMinMax.min, costMinMax.max),
        [costMinMax.min, costMinMax.max]
    );

    // Initialize slider to full dataset range
    React.useEffect(() => {
        setCostRange([costMinMax.min, costMinMax.max]);
    }, [costMinMax.min, costMinMax.max]);



    // Count active filters ( immediate feedback)
    const activeFilterCount = React.useMemo(() => {
        let count = 0;

        if (missionQuery.trim()) count += 1;
        if (selectedAgencies.length) count += 1;
        if (selectedMissionTypes.length) count += 1;
        if (selectedStatuses.length) count += 1;

        if (yearRange.from != null || yearRange.to != null) count += 1;

        const [minCost, maxCost] = costRange;
        if (minCost !== costMinMax.min || maxCost !== costMinMax.max) count += 1;

        if (costRange[0] !== costMinMax.min || costRange[1] !== costMinMax.max) count += 1;


        return count;
    }, [
        missionQuery,
        selectedAgencies,
        selectedMissionTypes,
        selectedStatuses,
        yearRange.from,
        yearRange.to,
        costRange,
        costMinMax.min,
        costMinMax.max,
    ]);

    // Apply filters immediately
    const filteredMissions = React.useMemo(() => {
        const q = missionQuery.trim().toLowerCase();

        return missions.filter((m) => {
            if (q && !m.name.toLowerCase().includes(q)) return false;

            if (selectedAgencies.length && !selectedAgencies.includes(m.agency)) return false;

            if (selectedMissionTypes.length && !selectedMissionTypes.includes(m.missionType)) return false;

            if (selectedStatuses.length && !selectedStatuses.includes(m.status)) return false;

            // Year range
            if (yearRange.from != null && m.year < yearRange.from) return false;
            if (yearRange.to != null && m.year > yearRange.to) return false;

            // Cost range

            if (typeof m.cost === "number") {
                if (m.cost < costRange[0] || m.cost > costRange[1]) return false;
            }

            return true;
        });
    }, [
        missions,
        missionQuery,
        selectedAgencies,
        selectedMissionTypes,
        selectedStatuses,
        yearRange.from,
        yearRange.to,
        costRange,
    ]);

    // Apply sorting
    const visibleMissions = React.useMemo(() => {
        const copy = [...filteredMissions];

        switch (sortKey) {
            case "name_asc":
                copy.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "year_desc":
                copy.sort((a, b) => b.year - a.year);
                break;
            case "year_asc":
            default:
                copy.sort((a, b) => a.year - b.year);
                break;
        }

        return copy;
    }, [filteredMissions, sortKey]);

    // Details dialog respects current visible order
    const [selectedMissionId, setSelectedMissionId] = React.useState<string | null>(null);

    // If filters change and selected item disappears, close dialog
    React.useEffect(() => {
        if (!selectedMissionId) return;
        const stillVisible = visibleMissions.some((m) => m.id === selectedMissionId);
        if (!stillVisible) setSelectedMissionId(null);
    }, [selectedMissionId, visibleMissions]);

    const selectedIndex = selectedMissionId
        ? visibleMissions.findIndex((m) => m.id === selectedMissionId)
        : -1;

    const selectedMission = selectedIndex >= 0 ? visibleMissions[selectedIndex] : null;
    const hasPrev = selectedIndex > 0;
    const hasNext = selectedIndex >= 0 && selectedIndex < visibleMissions.length - 1;

    const openMission = (id: string) => setSelectedMissionId(id);
    const closeMission = () => setSelectedMissionId(null);
    const goPrev = () => hasPrev && setSelectedMissionId(visibleMissions[selectedIndex - 1].id);
    const goNext = () => hasNext && setSelectedMissionId(visibleMissions[selectedIndex + 1].id);

    const clearAll = () => {
        setMissionQuery("");
        setSelectedAgencies([]);
        setSelectedMissionTypes([]);
        setSelectedStatuses([]);
        setYearRange({});
        setCostRange([costMinMax.min, costMinMax.max]);
    };

    const sidebarProps = {
        missionTypes,
        statuses,
        costMin: costMinMax.min,
        costMax: costMinMax.max,
        costStep,
        selectedMissionTypes,
        onSelectedMissionTypesChange: setSelectedMissionTypes,
        selectedStatuses,
        onSelectedStatusesChange: setSelectedStatuses,
        yearRange,
        onYearRangeChange: setYearRange,
        costRange,
        onCostRangeChange: setCostRange,
        activeFilterCount,
        onClearAll: clearAll,
    } as const;

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <Box sx={{ display: "flex" }}>
                {/* Desktop sidebar */}
                <Box
                    component="aside"
                    sx={{
                        width: 320,
                        flexShrink: 0,
                        bgcolor: "background.paper",
                        borderRight: 1,
                        borderColor: "divider",
                        display: { xs: "none", md: "block" },
                    }}
                >
                    <FiltersSidebar {...sidebarProps} />
                </Box>

                {/* Main content */}
                <Box component="main" sx={{ flex: 1, px: { xs: 2, md: 6 }, py: 5 }}>
                    <ExplorerHeader
                        title="space missions"
                        subtitle="Browse missions, filter results, and explore detailed information"
                    />

                    {/* Mobile Filters button */}
                    <Box sx={{ display: { xs: "flex", md: "none" }, mb: 2 }}>
                        <Button variant="outlined" onClick={() => setFiltersOpen(true)}>
                            Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}
                        </Button>
                    </Box>

                    <ExplorerToolbar
                        agencies={agencies}
                        missionQuery={missionQuery}
                        onMissionQueryChange={setMissionQuery}
                        selectedAgencies={selectedAgencies}
                        onSelectedAgenciesChange={setSelectedAgencies}
                        sortKey={sortKey}
                        onSortKeyChange={setSortKey}
                    />

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Showing {visibleMissions.length} of {missions.length} missions
                    </Typography>

                    <MissionsGrid missions={visibleMissions} onOpenMission={openMission} />

                    <MissionDetailsDialog
                        open={Boolean(selectedMissionId)}
                        mission={selectedMission}
                        onClose={closeMission}
                        hasPrev={hasPrev}
                        hasNext={hasNext}
                        onPrev={goPrev}
                        onNext={goNext}
                    />
                </Box>
            </Box>

            {/* Mobile full-screen filters */}
            <Drawer
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                anchor="left"
                PaperProps={{ sx: { width: "100vw" } }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
                    <Typography sx={{ fontWeight: 900 }}>Filters</Typography>
                    <IconButton onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <FiltersSidebar
                    missionTypes={missionTypes}
                    statuses={statuses}
                    costMin={costMinMax.min}
                    costMax={costMinMax.max}
                    costStep={costStep}
                    selectedMissionTypes={selectedMissionTypes}
                    onSelectedMissionTypesChange={setSelectedMissionTypes}
                    selectedStatuses={selectedStatuses}
                    onSelectedStatusesChange={setSelectedStatuses}
                    yearRange={yearRange}
                    onYearRangeChange={setYearRange}
                    costRange={costRange}
                    onCostRangeChange={setCostRange}
                    activeFilterCount={activeFilterCount}
                    onClearAll={clearAll}
                />


            </Drawer>
        </Box>
    );
}
