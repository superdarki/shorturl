import { purple } from '@mui/material/colors';
import { createTheme } from "@mui/material/styles";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default createTheme({
    palette: {
        mode:'dark',
        primary: purple,
        contrastThreshold: 4.5
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
                        color: purple,
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
        }
    }
});