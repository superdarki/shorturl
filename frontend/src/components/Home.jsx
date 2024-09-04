import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";

import Login from './Login';
import Link from './Link';

export default function Home() {
    const [token, setToken] = useState(localStorage.getItem("token")); // Load token from localStorage

    if (!token) {
        return <Login setToken={setToken} />;
    }

    const handleLogout = () => {
        // Clear token from localStorage and state
        localStorage.removeItem("token");
        setToken(null);  // Reset token state
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            minWidth="60vh"
            position="relative"  // Set position relative for the parent Box
        >
            <Grid container spacing={1}>
                <Grid 
                    item size={12}
                    display="flex"
                    justifyContent="center"
                >
                    <Typography variant="h1">Short URL</Typography>
                </Grid>
                <Link />
            </Grid>

            {/* Add the Logout button in the bottom-right corner */}
            <Box
                position="absolute"
                bottom={16}  // Distance from the bottom
                right={16}  // Distance from the right
            >
                <Button variant="contained" color="secondary" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>
        </Box>
    );
}