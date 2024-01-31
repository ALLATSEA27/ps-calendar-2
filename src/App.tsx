import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { format } from "date-fns";
import Calendar from "./components/Calendar";
import NotFound from "./components/NotFound";

const App = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = format(new Date(), "MM");
  const isGitHubPages = window.location.hostname.includes("github.io");
  const repoName = "ps-calendar-2";
  const basename = isGitHubPages ? `/${repoName}` : "";
  return (
    <Router basename={basename}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`/${currentYear}/${currentMonth}`} replace />}
        />
        <Route path="/:year/:month" element={<Calendar />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
