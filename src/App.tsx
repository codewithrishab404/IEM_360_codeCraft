// Libraries
import { Routes, Route } from "react-router";
// Pages Import
import Home from "@/pages/Home";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
// Driver Management
import DriverManagement from "./pages/DriverManagement/DriverManagement.tsx";
import AddDriver from "./pages/DriverManagement/AddDriver.tsx";
import DriverDetails from "./pages/DriverManagement/DriverDetails.tsx";
import EditDriver from "./pages/DriverManagement/EditDriver.tsx";
// Route Management
import BusRoutes from "./pages/RoutesManagement/BusRoutes.tsx";
import AddRoute from "./pages/RoutesManagement/AddRoute.tsx";
import RouteDetails from "./pages/RoutesManagement/RouteDetails.tsx";
import EditRoute from "./pages/RoutesManagement/EditRoute.tsx";
// Schedule Management
import BusSchedules from "./pages/ScheduleManagement/BusSchedules.tsx";
import AddSchedule from "./pages/ScheduleManagement/AddSchedule.tsx";
import EditSchedule from "./pages/ScheduleManagement/EditSchedule.tsx";
import ScheduleDetails from "./pages/ScheduleManagement/ScheduleDetails.tsx";
//Auth
import Auth from "./pages/Auth.tsx";
// Report
import ReportPage from "./pages/ReportPage.tsx";

RouteDetails;
function App() {
  return (
    <>
      <Routes>
        {/* Home and Authentication */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        {/* Dashboard */}
        <Route path="dashboard/" element={<Dashboard />}>
          {/* Dashboard home */}
          <Route path="" element={<DashboardHome />} />
          {/* Driver Management */}
          <Route path="driver-manager" element={<DriverManagement />} />
          <Route path="driver-manager/new" element={<AddDriver />} />
          <Route path="driver-manager/:id" element={<DriverDetails />} />
          <Route path="driver-manager/edit/:id" element={<EditDriver />} />
          {/* Route Management */}
          <Route path="routes" element={<BusRoutes />} />
          <Route path="routes/new" element={<AddRoute />} />
          <Route path="routes/:id" element={<RouteDetails />} />
          <Route path="routes/edit/:id" element={<EditRoute />} />
          {/* Schedule Management */}
          <Route path="schedules" element={<BusSchedules />} />
          <Route path="schedules/add-schedules" element={<AddSchedule />} />
          <Route path="schedules/edit/:id" element={<EditSchedule />} />
          <Route path="schedules/:id" element={<ScheduleDetails />} />
          <Route path="report" element={<ReportPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
