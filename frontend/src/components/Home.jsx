import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";

import Login from './Login';
import Link from './Link';

export default function Home() {
    const [token, setToken] = useState(null); // Initialize token state to null

    // Effect to check if the user is authenticated
    useEffect(() => {
        // Optionally, you can make a fetch request to check if the user is logged in
        const checkAuth = async () => {
            const response = await fetch(`${window._env_.API_URL}/check-auth`, {
                credentials: 'include', // Include cookies in the request
            });

            if (response.ok) {
                // Optionally, set token state or user data if needed
                setToken('authenticated'); // Just to indicate that the user is authenticated
            } else {
                setToken(null); // User is not authenticated
            }
        };

        checkAuth();
    }, []);

    // Handle logout by making a request to the server to clear the session
    const handleLogout = async () => {
        const response = await fetch(`${window._env_.API_URL}/logout`, {
            method: 'POST',
            credentials: 'include', // Include cookies in the request
        });

        if (response.ok) {
            setToken(null); // Reset token state
        }
    };

    if (!token) {
        return <Login setToken={setToken} />;
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            minWidth="60vh"
            position="relative"
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
