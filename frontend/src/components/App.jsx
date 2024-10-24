import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Dark from '../themes/Dark';
import Home from "./Home";
import Redirect from "./Redirect";

const app_path = window._env_.APP_PATH;

export default function App() {
    if (window.location.pathname.replace(/^\/+|\/+$/g, "") == app_path.replace(/^\/+|\/+$/g, "")) {
        return (
            <ThemeProvider theme={Dark}>
                <CssBaseline />
                <Router>
                    <Routes>
                        <Route path="*" element={<Home />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        );
    } else {
        return (
            <ThemeProvider theme={Dark}>
                <CssBaseline />
                <Router>
                    <Routes>
                        <Route path="*" element={<Redirect />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        );
    }
};
