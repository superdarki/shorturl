import { Route, BrowserRouter as Router } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Dark from '../themes/Dark';

import Home from "./Home";
import Redirect from "./Redirect";

export default function App() {
    return (
        <ThemeProvider theme={Dark}>
            <CssBaseline />
            <Router>
                <Route path="/" element={<Home />} />
                <Route path="/:id" element={<Redirect />} />
                <Route path="*" element={<Home />} />
            </Router>
        </ThemeProvider>
    );
};
