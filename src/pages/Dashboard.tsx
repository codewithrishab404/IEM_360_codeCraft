// Library import
import { Outlet } from "react-router";
import { NavElements } from "@/lib";

// Image import
import bgImage from "@/assets/background.jpg";

// Icons import
import { RiHome2Line } from "react-icons/ri";
import { FaUsersGear } from "react-icons/fa6";
import { FaRoute } from "react-icons/fa";
import { AiOutlineSchedule } from "react-icons/ai";
import { MdSpaceDashboard } from "react-icons/md";

import Sidebar from "@/components/Sidebar";

function Dashboard() {
  const navElements: NavElements[] = [
    {
      displayName: "Home",
      linkTo: "/",
      logo: <RiHome2Line />,
    },
    {
      displayName: "Dashboard",
      linkTo: "/dashboard/",
      logo: <MdSpaceDashboard />,
    },
    {
      displayName: "Driver Management",
      linkTo: "/dashboard/driver-manager",
      logo: <FaUsersGear />,
    },
    {
      displayName: "Routes Management",
      linkTo: "/dashboard/routes",
      logo: <FaRoute />,
    },
    {
      displayName: "Schedule Management",
      linkTo: "/dashboard/schedules",
      logo: <AiOutlineSchedule />,
    },
  ];
  return (
    <>
      <div
        className="flex  min-h-screen"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full">
          <Outlet />
        </div>
        <div>
          <Sidebar navElements={navElements} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
