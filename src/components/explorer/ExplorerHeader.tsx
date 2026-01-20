import { Box, Typography } from "@mui/material";

type Props = {
    title: string;
    subtitle: string;
};

export default function ExplorerHeader({ title, subtitle }: Props) {
    return (
        <Box sx={{ mb: 4 }}>
            <Typography
                variant="h3"
                component="h1"
                sx={{ fontWeight: 800, letterSpacing: -0.5 }}
            >
                {title}
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
            </Typography>
        </Box>
    );
}
