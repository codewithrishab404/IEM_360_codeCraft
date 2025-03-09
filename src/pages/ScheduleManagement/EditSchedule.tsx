import { app } from "@/firebase";
import { useEffect, useState, useRef } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";
import bgImage from "@/assets/background.jpg";

const EditSchedule = () => {
  const { id } = useParams();
  const [busName, setBusName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [route, setRoute] = useState("");
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!id) {
        console.error("Invalid ID");
        return;
      }

      try {
        const docRef = doc(db, "schedules", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBusName(data.busName || "");
          setDriverName(data.driverName || "");
          setStartTime(data.startTime || "");
          setEndTime(data.endTime || "");
          setRoute(data.route || "");
        } else {
          console.error("No such schedule found!");
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  const handleUpdate = async () => {
    if (!id) {
      console.error("Invalid ID for update");
      return;
    }

    try {
      const docRef = doc(db, "schedules", id);
      await updateDoc(docRef, {
        busName,
        driverName,
        startTime,
        endTime,
        route,
      });

      gsap.to(formRef.current, {
        opacity: 0,
        y: -50,
        scale: 0.9,
        duration: 0.8,
        ease: "power3.in",
        onComplete: () => navigate("/dashboard/schedules") as any,
      });
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  return (
    <div
      className="p-6 bg-gradient-to-r from-gray-900 to-gray-700 min-h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        ref={formRef}
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Edit Schedule
        </h2>
        {loading ? (
          <p className="text-center text-gray-700">Loading...</p>
        ) : (
          <>
            <input
              className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={busName}
              onChange={(e) => setBusName(e.target.value)}
              placeholder="Bus Name"
            />
            <input
              className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="Driver Name"
            />
            <input
              className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="Start Time"
            />
            <input
              className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="End Time"
            />
            <input
              className="w-full p-3 border rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              placeholder="Route"
            />

            <button
              onClick={handleUpdate}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Save Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EditSchedule;