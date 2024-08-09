import Login from "./components/Login/Login";
import AddSpeakers from "./components/AddSpeakers/AddSpeakers";
import EditSpeakers from "./components/EditSpeakers/EditSpeakers";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import ScheduleList from "./components/ScheduleList/ScheduleList";
import AddSchedule from "./components/AddSchedule/AddSchedule";
// import Header from "./components/Header/Header";
// import useAuth from "./hooks/useAuth";
// import ValidHead from './components/Header/ValidHead'

const AppRoutes = () => {
  // const { auth } = useAuth();

  let token = localStorage.getItem("token");

  return (
    <div>
      {/* <ValidHead /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="/speakers" element={<AddSpeakers />} />
          <Route path="/add-speakers" element={<EditSpeakers />} />
          <Route path="/add-schedule" element={<AddSchedule />} />
          <Route path="/schedule" element={<ScheduleList />} />
        </Route>
      </Routes>
    </div>
  );
};

const NotFound = () => {
  return <h1>Page Not Found</h1>;
};

export default AppRoutes;
