import { ThemeProvider } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from '@mui/material/Typography';
import CssBaseline from "@mui/material/CssBaseline";

import Link from './Link';
import Dark from '../themes/Dark';

export default function Home() {
    return (
        <ThemeProvider theme={Dark}>
            <CssBaseline />
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                minWidth="60vh"
            >
                <Grid
                    container
                    spacing={1}
                >
                    <Grid 
                        size={12}
                        display="flex"
                        justifyContent="center"
                    >
                        <Typography variant="h1">Short URL</Typography>
                    </Grid>
                    <Link/>
                </Grid>
            </Box>
        </ThemeProvider>
    );
};
