"use client";

import * as React from "react";
import {
    Alert,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    Snackbar,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import type { Mission } from "@/types/mission";
import ExplorerHeader from "./ExplorerHeader";
import ExplorerToolbar from "./ExplorerToolbar";
import FiltersSidebar from "./FiltersSidebar";
import MissionsGrid from "./MissionsGrid";
import MissionDetailsDialog from "./MissionDetailsDialog";

export type SortKey = "name_asc" | "year_asc" | "year_desc";
type Props = { missions: Mission[] };
type YearRange = { from?: number; to?: number };

const FAVORITES_KEY = "uxui-spacemissions:favorites";

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
    // Top toolbar
    const [missionQuery, setMissionQuery] = React.useState("");
    const [selectedAgencies, setSelectedAgencies] = React.useState<string[]>([]);
    const [sortKey, setSortKey] = React.useState<SortKey>("year_asc");

    // Sidebar filters
    const [selectedMissionTypes, setSelectedMissionTypes] = React.useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);
    const [yearRange, setYearRange] = React.useState<YearRange>({});
    const [costRange, setCostRange] = React.useState<[number, number]>([0, 0]);

    // Mobile filters
    const [filtersOpen, setFiltersOpen] = React.useState(false);

    // Favorites
    const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
    const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);

    // Toast feedback
    const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string }>({
        open: false,
        message: "",
    });

    // Dataset options
    const agencies = React.useMemo(() => uniqueSorted(missions.map((m) => m.agency)), [missions]);
    const missionTypes = React.useMemo(
        () => uniqueSorted(missions.map((m) => m.missionType)),
        [missions]
    );
    const statuses = React.useMemo(() => uniqueSorted(missions.map((m) => m.status)), [missions]);

    // Cost range from dataset
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

    // Initialize slider once dataset range is known
    React.useEffect(() => {
        setCostRange([costMinMax.min, costMinMax.max]);
    }, [costMinMax.min, costMinMax.max]);

    // Load favorites on mount
    React.useEffect(() => {
        try {
            const raw = localStorage.getItem(FAVORITES_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                setFavorites(new Set(parsed.filter((x) => typeof x === "string")));
            }
        } catch {
            // ignore corrupted storage
        }
    }, []);

    // Persist favorites
    React.useEffect(() => {
        try {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
        } catch {
            // ignore storage errors
        }
    }, [favorites]);

    const toggleFavorite = React.useCallback((id: string) => {
        setFavorites((prev) => {
            const next = new Set(prev);
            const isAdding = !next.has(id);

            if (isAdding) next.add(id);
            else next.delete(id);

            setSnackbar({
                open: true,
                message: isAdding ? "Added to favorites" : "Removed from favorites",
            });

            return next;
        });
    }, []);

    // Active filter count (for "Filters (n)" UX)
    const activeFilterCount = React.useMemo(() => {
        let count = 0;

        if (missionQuery.trim()) count += 1;
        if (selectedAgencies.length) count += 1;
        if (selectedMissionTypes.length) count += 1;
        if (selectedStatuses.length) count += 1;

        if (yearRange.from != null || yearRange.to != null) count += 1;

        if (costRange[0] !== costMinMax.min || costRange[1] !== costMinMax.max) count += 1;

        if (showFavoritesOnly) count += 1;

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
        showFavoritesOnly,
    ]);

    // Filter
    const filteredMissions = React.useMemo(() => {
        const q = missionQuery.trim().toLowerCase();

        return missions.filter((m) => {
            if (q && !m.name.toLowerCase().includes(q)) return false;

            if (selectedAgencies.length && !selectedAgencies.includes(m.agency)) return false;

            if (selectedMissionTypes.length && !selectedMissionTypes.includes(m.missionType)) return false;

            if (selectedStatuses.length && !selectedStatuses.includes(m.status)) return false;

            if (yearRange.from != null && m.year < yearRange.from) return false;
            if (yearRange.to != null && m.year > yearRange.to) return false;

            if (typeof m.cost === "number") {
                if (m.cost < costRange[0] || m.cost > costRange[1]) return false;
            }

            if (showFavoritesOnly && !favorites.has(m.id)) return false;

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
        showFavoritesOnly,
        favorites,
    ]);

    // Sort
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

    // Details dialog navigation
    const [selectedMissionId, setSelectedMissionId] = React.useState<string | null>(null);

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
        setShowFavoritesOnly(false);
    };

    // Share sidebar props for desktop + mobile
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
        showFavoritesOnly,
        onShowFavoritesOnlyChange: setShowFavoritesOnly,
        favoritesCount: favorites.size,
        activeFilterCount,
        onClearAll: clearAll,
    } as const;


    const isFavorited = React.useCallback((id: string) => favorites.has(id), [favorites]);

    const selectedIsFavorited = Boolean(selectedMission && favorites.has(selectedMission.id));

    const toggleSelectedFavorite = React.useCallback(() => {
        if (!selectedMission) return;
        toggleFavorite(selectedMission.id);
    }, [selectedMission, toggleFavorite]);

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
                        title="Space Missions"
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

                    <MissionsGrid
                        missions={visibleMissions}
                        onOpenMission={openMission}
                        isFavorited={isFavorited}
                        onToggleFavorite={toggleFavorite}
                    />

                    <MissionDetailsDialog
                        open={Boolean(selectedMissionId)}
                        mission={selectedMission}
                        onClose={closeMission}
                        hasPrev={hasPrev}
                        hasNext={hasNext}
                        onPrev={goPrev}
                        onNext={goNext}
                        isFavorited={selectedIsFavorited}
                        onToggleFavorite={toggleSelectedFavorite}
                    />
                </Box>
            </Box>

            {/* Mobile filters */}
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

                <FiltersSidebar {...sidebarProps} />
            </Drawer>

            {/* Snackbar feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                    sx={{ borderRadius: 2 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
