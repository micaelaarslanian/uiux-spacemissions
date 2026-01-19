"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: { mode: "dark" },
    shape: { borderRadius: 12 },
    typography: {
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    },
});

export default theme;
