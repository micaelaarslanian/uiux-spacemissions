"use client";
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
    interface TypeBackground {
        dialogue: string;
    }
}

const theme = createTheme({
    palette: {
        mode: "dark",

        primary: {
            main: "#f6b13b",
        },

        success: { main: "#139040" },
        error: { main: "#941212" },
        info: { main: "#1f51a1" },
        grey: {
            500: "#575b61",
        },

        background: {
            default: "#110c06",
            paper: "#1c1710",
            dialogue: "#12100d",

        },

        text: {
            primary: "#F5F5F4",
            secondary: "#B8B2AA",
        },

        divider: "rgba(245, 158, 11, 0.15)",
    },

    shape: { borderRadius: 12 },

    typography: {
        fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    },

    components: {
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    borderRadius: 10,
                },
            },
        },

        MuiCssBaseline: {
            styleOverrides: {
                ".filterChip.MuiChip-filled": {
                    backgroundColor: "#F59E0B",
                    color: "#1A150D",
                },
                ".filterChip.MuiChip-filled:hover": {
                    backgroundColor: "#D97706",
                },
                ".filterChip.MuiChip-outlined": {
                    borderColor: "rgba(245, 158, 11, 0.35)",
                    color: "#F5F5F4",
                },
                ".filterChip.MuiChip-outlined:hover": {
                    backgroundColor: "rgba(245, 158, 11, 0.08)",
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: "#2A241C",
                    border: "1px solid rgba(245, 158, 11, 0.10)",
                },
            },
        },

        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: "#1A1510",
                    borderRight: "1px solid rgba(245, 158, 11, 0.18)",
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: "none",
                },
            },
        },

        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backgroundColor: "rgba(0, 0, 0, 0.95)",
                },
            },
        },
    },
});



export default theme;
