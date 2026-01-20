"use client";

import {
    Autocomplete,
    Box,
    InputAdornment,
    MenuItem,
    TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { SortKey } from "./ExplorerLayout";

// Props for ExplorerToolbar component
type Props = {
    agencies: string[];

    missionQuery: string;
    onMissionQueryChange: (value: string) => void;

    selectedAgencies: string[];
    onSelectedAgenciesChange: (value: string[]) => void;

    sortKey: SortKey;
    onSortKeyChange: (value: SortKey) => void;
};

// ExplorerToolbar component
export default function ExplorerToolbar({
    agencies,
    missionQuery,
    onMissionQueryChange,
    selectedAgencies,
    onSelectedAgenciesChange,
    sortKey,
    onSortKeyChange,
}: Props) {
    return (

        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr auto" },
                gap: 2.5,
                alignItems: "center",
            }}
        >
            {/*Search by Mission Name */}
            <TextField
                fullWidth
                value={missionQuery}
                onChange={(e) => onMissionQueryChange(e.target.value)}
                placeholder="Search mission"
                slotProps={{
                    input: {
                        "aria-label": "Search missions by name",
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 999 } }}
            />


            {/*Search by Agencies */}
            <Autocomplete
                multiple
                options={agencies}
                value={selectedAgencies}
                onChange={(_, value) => onSelectedAgenciesChange(value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Agency"
                        slotProps={{
                            htmlInput: {
                                ...params.inputProps,
                                "aria-label": "Search missions by agencies",
                            },
                        }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 999 } }}
                    />
                )}
            />

            {/*Sort by year asc / desc / A-Z */}
            <TextField
                select
                label="Sort by"
                value={sortKey}
                onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
                slotProps={{
                    htmlInput: {
                        "aria-label": "Sort missions",
                    },
                }}
                sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
                <MenuItem value="name_asc">Name (A–Z)</MenuItem>
                <MenuItem value="year_asc">Year (Asc)</MenuItem>
                <MenuItem value="year_desc">Year (Desc)</MenuItem>
            </TextField>
        </Box>
    );
}
