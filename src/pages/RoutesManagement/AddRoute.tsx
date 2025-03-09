import { useState } from "react";
import { app } from "@/firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bgImage from "@/assets/background.jpg";

const AddRoute = () => {
  const [name, setName] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [busStops, setBusStops] = useState<string[]>([]);
  const db = getFirestore(app);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "routes"), {
        name,
        startLocation,
        endLocation,
        busStops,
      });
      navigate("/");
    } catch (error) {
      console.error("Error adding route:", error);
    }
  };

  return (
    <motion.div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="p-6 flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200"
    >
      <motion.form
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg border-l-4 border-green-500"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-bold text-gray-800 mb-6 text-center"
        >
          Add New Route
        </motion.h2>

        <div className="grid gap-4">
          <motion.input
            whileFocus={{ scale: 1.05 }}
            className="input-field"
            placeholder="Route Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <motion.input
            whileFocus={{ scale: 1.05 }}
            className="input-field"
            placeholder="Start Location"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            required
          />
          <motion.input
            whileFocus={{ scale: 1.05 }}
            className="input-field"
            placeholder="End Location"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            required
          />
          <motion.input
            whileFocus={{ scale: 1.05 }}
            className="input-field"
            placeholder="Bus Stops (comma separated)"
            onChange={(e) => setBusStops(e.target.value.split(","))}
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg mt-6 w-full hover:bg-green-700 transition-all"
        >
          🚀 Create Route
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default AddRoute;
