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
  return (
    <Router>
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
