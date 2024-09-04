import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "./Home";
import Redirect from "./Redirect";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:id" element={<Redirect />} />
            </Routes>
        </Router>
    );
};
