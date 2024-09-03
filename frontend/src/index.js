import React from 'react';
import ReactDOM from "react-dom";
import { TextField, Button } from '@mui/material';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

//import Links from './components/Link';

const themeDark = createTheme({
    palette: {
        
    },
    colorSchemes: {
        dark: true
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label.Mui-focused': {
                        color: '#3E68A8',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#ffffff',
                        },
                        '&:hover fieldset': {
                            borderColor: '#3E68A8',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#3E68A8',
                            borderWidth: '0.15rem'
                        },
                    },
                }
            }
        },
        MuiButton: {
            styleOverrides: {
            }
        }
    }
});

const App = () => {
    return (
        <ThemeProvider theme={themeDark}>
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
                        <h1>ShortURL</h1>
                    </Grid>
                    <Grid 
                        size="grow"
                        display="flex"
                        justifyContent="center"
                    >
                        <TextField
                            hiddenLabel
                            fullWidth
                            id="link-to-shorten"
                            variant="outlined"
                            text
                        />
                    </Grid>
                    <Grid 
                        size="auto"
                        display="flex"
                        justifyContent="center"
                    >
                        <Button variant="contained">Shorten</Button>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
  };


const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);