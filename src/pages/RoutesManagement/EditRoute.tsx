import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "@/firebase";
import gsap from "gsap";
import { motion } from "framer-motion";
import bgImage from "@/assets/background.jpg";

interface Route {
  name: string;
  startLocation: string;
  endLocation: string;
  busStops: string;
}

const EditRoute: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const db = getFirestore(app);
  const formRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [route, setRoute] = useState({
    name: "",
    startLocation: "",
    endLocation: "",
    busStops: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "routes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setRoute({
            name: data.name,
            startLocation: data.startLocation,
            endLocation: data.endLocation,
            busStops: data.busStops.join(", "),
          });
        } else {
          console.error("Route not found!");
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoute();
  }, [id]);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power4.out" }
    );
    gsap.fromTo(
      "input, textarea",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, stagger: 0.15, ease: "power3.out" }
    );
    gsap.to(buttonRef.current, {
      y: -5,
      repeat: -1,
      duration: 1.5,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRoute({ ...route, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      const docRef = doc(db, "routes", id);
      await updateDoc(docRef, {
        name: route.name,
        startLocation: route.startLocation,
        endLocation: route.endLocation,
        busStops: route.busStops.split(",").map((stop) => stop.trim()),
      });
      gsap.to(formRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => navigate("/dashboard/routes") as any,
      });
    } catch (error) {
      console.error("Error updating route:", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg animate-pulse">Loading...</p>
      </div>
    );

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full transition-all duration-300"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Edit Route
        </h2>

        <div className="space-y-4">
          {["name", "startLocation", "endLocation"].map((name) => (
            <motion.input
              key={name}
              type="text"
              name={name}
              value={route[name as keyof Route]}
              onChange={handleChange}
              placeholder={name.replace(/([A-Z])/g, " $1").trim()}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-transform transform focus:scale-105"
              whileFocus={{ scale: 1.05 }}
            />
          ))}
          <motion.textarea
            name="busStops"
            value={route.busStops}
            onChange={handleChange}
            placeholder="Bus Stops (comma-separated)"
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-transform transform focus:scale-105"
            whileFocus={{ scale: 1.05 }}
          />
        </div>

        <div className="flex justify-between mt-6">
          <motion.button
            onClick={() => navigate("/dashboard/routes")}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Cancel
          </motion.button>
          <motion.button
            ref={buttonRef}
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditRoute;
