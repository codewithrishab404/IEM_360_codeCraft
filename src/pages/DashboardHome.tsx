import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../firebase";
import { CgPerformance } from "react-icons/cg";
// import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

const DashboardHome: React.FC = () => {
  const localUser = localStorage.getItem("user");
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [incidents, setIncidents] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  const performance = {
    skill: 80,
    communication: 75,
    total: 85,
  };

  const navigate = useNavigate();
  const db = getFirestore(app);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setRole(user.role);
      setName(user.fullName);

      if (user.role === "admin") {
        fetchDrivers(user.uid);
        fetchIncidents();
        fetchMaintenance();
      }
    } else {
      navigate("/");
    }
  }, []);

  const fetchDrivers = async (adminId: string) => {
    const q = query(
      collection(db, "drivers"),
      where("adminUid", "==", adminId)
    );
    const snapshot = await getDocs(q);
    setDrivers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchIncidents = async () => {
    try {
      const querySnapshot1 = await getDocs(collection(db, "incidents"));
      const incidentData = querySnapshot1.docs.map((doc) => ({
        ...doc.data(),
      }));
      setIncidents(incidentData as any);
      console.log(incidentData);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };
  const fetchMaintenance = async () => {
    try {
      const querySnapshot2 = await getDocs(collection(db, "maintenance"));
      const maintenanceData = querySnapshot2.docs.map((doc) => ({
        ...doc.data(),
      }));
      setMaintenance(maintenanceData as any);
      console.log(maintenanceData);
    } catch (error) {
      console.error("Error fetching maintenance:", error);
    }
  };

  return (
    <main className="p-6 min-h-screen bg-cover bg-center">
      {role === "admin" ? (
        <>
          <div>
            <motion.h1
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Welcome, {name}
            </motion.h1>
            <motion.h2
              className="text-xl font-semibold mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Your Drivers
            </motion.h2>
            <motion.div
              className=""
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <table className="w-full overflow-x-auto p-4 rounded-lg shadow-md bg-white opacity-80">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.length > 0 ? (
                    drivers.map((driver) => (
                      <motion.tr
                        key={driver.id}
                        className="border-t hover:bg-gray-100 transition-all"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <td className="p-2">{driver.name}</td>
                        <td className="p-2">{driver.email}</td>
                        <td className="p-2 text-green-600 font-semibold">
                          Active
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500">
                        No drivers assigned yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
            {/* Incident */}
            <motion.h2
              className="text-xl font-semibold my-4 mt-10 text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Incident reports
            </motion.h2>
            <motion.div
              className=""
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <table className="w-full overflow-x-auto p-4 rounded-lg shadow-md bg-white opacity-80">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Incident description</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.length > 0 ? (
                    incidents.map((inc: any, idx) => (
                      <motion.tr
                        key={idx}
                        className="border-t hover:bg-gray-100 transition-all"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <td className="p-2">{inc.name}</td>
                        <td className="p-2">{inc.incident}</td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500">
                        No incident report found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
            {/* Maintenance report  */}
            <motion.h2
              className="text-xl font-semibold my-4 mt-10 text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Maintenance reports
            </motion.h2>
            <motion.div
              className=""
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <table className="w-full overflow-x-auto p-4 rounded-lg shadow-md bg-white opacity-80">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Maintenance description</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenance.length > 0 ? (
                    maintenance.map((inc: any, idx) => (
                      <motion.tr
                        key={idx}
                        className="border-t hover:bg-gray-100 transition-all"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <td className="p-2">{inc.name}</td>
                        <td className="p-2">{inc.maintenance}</td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500">
                        No maintainence report found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          </div>
        </>
      ) : (
        <>
          {localUser && (
            <>
              <motion.div
                className="flex flex-col items-center mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* <FaUser size={80} className="rounded-full bg-gray-300 p-3" /> */}
                <img
                  src={JSON.parse(localUser as any).profilePicture}
                  alt="profile pic"
                  className="h-40 w-40 rounded-full object-cover"
                />
                <h2 className="text-2xl font-semibold mt-2">
                  {JSON.parse(localUser as any).name}
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Skill Card */}
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <h3 className="text-lg font-semibold mb-2">Skill</h3>
                  <CgPerformance size={40} className="text-blue-500" />
                  <p className="text-2xl font-bold mt-2">
                    {performance.skill}%
                  </p>
                </motion.div>

                {/* Communication Card */}
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <h3 className="text-lg font-semibold mb-2">Communication</h3>
                  <CgPerformance size={40} className="text-green-500" />
                  <p className="text-2xl font-bold mt-2">
                    {performance.communication}%
                  </p>
                </motion.div>

                {/* Total Performance Card */}
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <h3 className="text-lg font-semibold mb-2">
                    Total Performance
                  </h3>
                  <CgPerformance size={40} className="text-red-500" />
                  <p className="text-2xl font-bold mt-2">
                    {performance.total}%
                  </p>
                </motion.div>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
};

export default DashboardHome;
