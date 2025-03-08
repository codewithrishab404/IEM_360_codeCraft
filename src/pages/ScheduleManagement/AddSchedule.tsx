import { useState, useEffect, useRef } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import bgImage from "@/assets/background.jpg";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AddSchedule = () => {
  const [busName, setBusName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [route, setRoute] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const db = getFirestore(app);
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, []);

  const toggleDaySelection = (day: string) => {
    setDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !busName ||
      !driverName ||
      !route ||
      !startTime ||
      !endTime ||
      days.length === 0
    ) {
      alert("Please fill all fields and select at least one operating day.");
      return;
    }
    try {
      await addDoc(collection(db, "schedules"), {
        busName,
        driverName,
        route,
        startTime,
        endTime,
        days,
      });
      navigate("/dashboard/schedules");
    } catch (error) {
      console.error("Error adding schedule:", error);
    }
  };

  return (
    <div
      className="p-6 bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg border-l-4 border-blue-500"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-6 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          🚌 Add Bus Schedule
        </motion.h2>

        <div className="grid gap-4">
          {[
            { placeholder: "Bus Name", value: busName, setter: setBusName },
            {
              placeholder: "Driver Name",
              value: driverName,
              setter: setDriverName,
            },
            {
              placeholder: "Route (e.g., Dharmatala to Durgapur)",
              value: route,
              setter: setRoute,
            },
          ].map((field, index) => (
            <motion.input
              key={index}
              className="input-field"
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              whileFocus={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          ))}
          <motion.input
            type="time"
            className="input-field"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
          <motion.input
            type="time"
            className="input-field"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          />

          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <motion.label
                key={day}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium ${
                  days.includes(day)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => toggleDaySelection(day)}
                whileTap={{ scale: 0.9 }}
              >
                {day}
              </motion.label>
            ))}
          </div>
        </div>

        <motion.button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-6 w-full hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          ➕ Add Schedule
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddSchedule;
