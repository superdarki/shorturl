import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

const api_url = window._env_.API_URL;

export default function Login({ setToken }) {
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const username = data.get("username");
        const password = data.get("password");

        try {
            const url = isRegister ? `${api_url}/register` : `${api_url}/login`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Specify JSON content type
                    'Accept': 'application/json',         // Good to specify
                },
                body: JSON.stringify({                  // Convert object to JSON string
                    username: username,                  // Use variables for dynamic data
                    password: password
                }),
                credentials: 'include',                 // Include credentials (cookies)
            });

            if (!response.ok) {
                // Handle error if the response status is not OK (e.g., 400 or 401)
                throw new Error(isRegister ? "Registration failed" : "Invalid username or password");
            }

            if (!isRegister) {
                const result = await response.json();
                const { access_token } = result; // You can remove this line if you don't need to use the token
                // Since we're using cookies, you don't need to store the token in localStorage
                setToken(access_token); // Optionally, you can keep this to update the parent state if needed
            } else {
                // If registering, switch back to login view after successful registration
                setIsRegister(false);
            }

        } catch (error) {
            // Handle errors
            setError(error.message);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{  
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography variant="h2">Short URL</Typography>
                <Typography component="h1" variant="h5">{isRegister ? "Register" : "Sign In"}</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {isRegister ? "Register" : "Sign In"}
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => setIsRegister(!isRegister)}
                    >
                        {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register"}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
