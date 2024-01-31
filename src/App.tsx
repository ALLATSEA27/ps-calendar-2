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
  const currentMonth = format(new Date(), "MM"); // Ensure you have the 'format' function from 'date-fns'

  return (
    <Router>
      <Routes>
        <Route
          path="/ps-calendar-2"
          element={
            <Navigate
              to={`/ps-calendar-2/${currentYear}/${currentMonth}`}
              replace
            />
          }
        />
        <Route path="/ps-calendar-2/:year/:month" element={<Calendar />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
