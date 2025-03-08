import { app } from "@/firebase";
import { useEffect, useState, useRef } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Link } from "react-router";
import { MdOutlineAdd } from "react-icons/md";
import gsap from "gsap";
import { motion } from "framer-motion";

interface Route {
  id: string;
  name: string;
  startLocation: string;
  busStops: string[];
  endLocation: string;
}

const BusRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (routes.length > 0) {
      gsap.fromTo(
        ".route-card",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
      );
    }
  }, [routes]);

  const fetchRoutes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "routes"));
      const routeData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Route[];
      setRoutes(routeData);
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRoute = async (routeId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this route?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "routes", routeId));
      setRoutes((prevRoutes) =>
        prevRoutes.filter((route) => route.id !== routeId)
      );
      alert("Route deleted successfully!");
    } catch (error) {
      console.error("Error deleting route:", error);
      alert("Failed to delete route.");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-5xl mx-auto" ref={containerRef}>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Bus Routes
        </h2>
        <div className="flex justify-end mb-6">
          <Link
            to="/dashboard/routes/new"
            className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-5 py-3 rounded-xl shadow-md hover:scale-105 transition-all"
          >
            <div className="flex gap-2 items-center">
              <MdOutlineAdd size={24} /> Add New Route
            </div>
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 mt-4">Loading...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {routes.map((route) => (
              <motion.div
                key={route.id}
                className="route-card p-5 rounded-xl shadow-md bg-white relative overflow-hidden border border-l-4 border-l-blue-500"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {route.name}
                </h3>
                <p className="text-gray-600">
                  <strong className="text-gray-700">Route:</strong>{" "}
                  {route.startLocation} → {route.endLocation}
                </p>
                <p className="text-gray-600 mt-1">
                  <strong className="text-gray-700">Stops:</strong>{" "}
                  {route.busStops.join(", ")}
                </p>

                <div className="flex gap-4 mt-5">
                  <Link
                    to={`/dashboard/routes/${route.id}`}
                    className="text-blue-600 hover:text-blue-500 transition-all"
                  >
                    View
                  </Link>
                  <Link
                    to={`/dashboard/routes/edit/${route.id}`}
                    className="text-green-600 hover:text-green-500 transition-all"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteRoute(route.id)}
                    className="text-red-600 hover:text-red-500 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusRoutes;
