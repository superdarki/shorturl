import React, { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from '@mui/material/Typography';
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { purple } from '@mui/material/colors';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Link from './components/Link';

const themeDark = createTheme({
    palette: {
        mode:'dark',
        primary: purple,
        contrastThreshold: 4.5,
        
    },
    colorSchemes: {
        dark: true
    },
    typography: {
        fontFamily: [
            'Roboto',
        ].join(','),
        h1: {
            fontSize: '6.5rem',
            fontWeight: 700
        },
        button: {
            fontSize: '1.3rem',
            fontWeight: 700
        }
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
                            borderWidth: '0.10rem'
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: purple,
                            borderWidth: '0.10rem'
                        }
                    }
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
                        <Typography variant="h1">Short URL</Typography>
                    </Grid>
                    <Link/>
                </Grid>
            </Box>
        </ThemeProvider>
    );
  };



  const rootElement = document.getElementById("root");
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
        <App/>
    </StrictMode>
  )