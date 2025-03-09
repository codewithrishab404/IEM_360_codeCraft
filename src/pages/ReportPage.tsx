import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase";

const db = getFirestore(app);
const auth = getAuth(app);

const FormWrapper = ({ children }: any) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const formRef = useRef(null);

  const handleMouseMove = (e: any) => {
    const { clientX, clientY } = e;
    setPosition({
      x: (clientX / window.innerWidth - 0.5) * 20,
      y: (clientY / window.innerHeight - 0.5) * 20,
    });
  };

  return (
    <motion.div
      ref={formRef}
      onMouseMove={handleMouseMove}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
      className="bg-white shadow-xl rounded-xl p-6 border border-gray-300 w-full md:w-1/2"
    >
      {children}
    </motion.div>
  );
};

const IncidentForm = ({ user }: any) => {
  const localUser = localStorage.getItem("user");

  const [incident, setIncident] = useState("");
  const buttonRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      buttonRef.current,
      { scale: 0.9 },
      {
        scale: 1,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        repeat: -1,
        yoyo: true,
      }
    );
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user && !localUser) {
      alert("Please log in to submit the form.");
      return;
    }

    try {
      await addDoc(collection(db, "incidents"), {
        driverId: user.uid, // Store driver ID
        incident,
        name: JSON.parse(localUser as any).name,
        adminUID: JSON.parse(localUser as any).adminUid,
        timestamp: new Date(),
      });
      setIncident("");
      alert("🚀 Incident Reported Successfully!");
    } catch (error) {
      console.error("Error reporting incident:", error);
    }
  };

  return (
    <FormWrapper>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        ⚠️ Report an Incident
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.textarea
          whileFocus={{ scale: 1.05 }}
          placeholder="Describe the incident..."
          value={incident}
          onChange={(e) => setIncident(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-md resize-none h-28"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          ref={buttonRef}
          type="submit"
          className="w-full bg-red-500 text-white font-bold py-3 rounded-lg shadow-lg transition hover:bg-red-600"
        >
          🚀 Submit Incident
        </motion.button>
      </form>
    </FormWrapper>
  );
};

const MaintenanceForm = ({ user }: any) => {
  const localUser = localStorage.getItem("user");

  const [maintenance, setMaintenance] = useState("");
  const buttonRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      buttonRef.current,
      { scale: 0.9 },
      {
        scale: 1,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        repeat: -1,
        yoyo: true,
      }
    );
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user && !localUser) {
      alert("Please log in to submit the form.");
      return;
    }

    try {
      await addDoc(collection(db, "maintenance"), {
        driverId: user.uid, // Store driver ID
        maintenance,
        name: JSON.parse(localUser as any).name,
        adminUID: JSON.parse(localUser as any).adminUid,
        timestamp: new Date(),
      });
      setMaintenance("");
      alert("🔧 Maintenance Request Submitted Successfully!");
    } catch (error) {
      console.error("Error submitting maintenance request:", error);
    }
  };

  return (
    <FormWrapper>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        🔧 Submit Maintenance Request
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.textarea
          whileFocus={{ scale: 1.05 }}
          placeholder="Describe the maintenance issue..."
          value={maintenance}
          onChange={(e) => setMaintenance(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400 transition shadow-md resize-none h-28"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          ref={buttonRef}
          type="submit"
          className="w-full bg-green-500 text-white font-bold py-3 rounded-lg shadow-lg transition hover:bg-green-600"
        >
          🔧 Submit Request
        </motion.button>
      </form>
    </FormWrapper>
  );
};

const ReportPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser as any);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center items-center p-6">
      {user ? (
        <>
          <IncidentForm user={user} />
          <MaintenanceForm user={user} />
        </>
      ) : (
        <p className="text-xl font-semibold text-red-500">
          Please login to fill the form.
        </p>
      )}
    </div>
  );
};

export default ReportPage;
