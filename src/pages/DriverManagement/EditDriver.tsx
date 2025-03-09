import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "@/firebase";
import gsap from "gsap";
import { motion } from "framer-motion";

interface DriverDetails {
  name: string;
  busName: string;
  route: string;
  email: string;
  mob: string;
  profilePicture: string;
}

const EditDriver: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const db = getFirestore(app);
  const formRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const user = localStorage.getItem("user");

  const [driver, setDriver] = useState<DriverDetails>({
    name: "",
    busName: "",
    route: "",
    email: "",
    mob: "",
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriver = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "drivers", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setDriver({
            name: data.name,
            busName: data.busName,
            route: data.route,
            email: data.email,
            mob: data.mob,
            profilePicture: data.profilePicture,
          });
          console.log("Data from firestore: ", data);
        } else {
          console.error("Route not found!");
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, [id]);

  //   useEffect(() => {
  //     gsap.fromTo(
  //       formRef.current,
  //       { opacity: 0, y: 50, scale: 0.9 },
  //       { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power4.out" }
  //     );
  //     gsap.fromTo(
  //       "input, textarea",
  //       { opacity: 0, x: -20 },
  //       { opacity: 1, x: 0, stagger: 0.15, ease: "power3.out" }
  //     );
  //     gsap.to(buttonRef.current, {
  //       y: -5,
  //       repeat: -1,
  //       duration: 1.5,
  //       yoyo: true,
  //       ease: "sine.inOut",
  //     });
  //   }, []);

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file); // Convert to Base64

    reader.onload = () => {
      const base64String = reader.result as string;
      setDriver({ ...driver, [e.target.name]: base64String });
    };

    reader.onerror = (error) =>
      console.error("Base64 conversion error:", error);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      const docRef = doc(db, "drivers", id);
      setLoading(true);
      await updateDoc(docRef, {
        name: driver.name,
        busName: driver.busName,
        route: driver.route,
        email: driver.email,
        mob: driver.mob,
        profilePicture: driver.profilePicture,
      });
      gsap.to(formRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => navigate(`/dashboard/driver-manager/${id}`) as any,
      });
    } catch (error) {
      console.error("Error updating driver:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg animate-pulse">Loading...</p>
      </div>
    );

  if (!user || JSON.parse(user).role !== "admin") {
    return (
      <>
        <div className="text-red-500 text-3xl text-center p-5">
          Please log in as admin to edit drivers!
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full transition-all duration-300"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          ✏️ Edit Driver Details
        </h2>

        <div className="space-y-4">
          {driver.profilePicture !== "" &&
          driver.profilePicture !== undefined ? (
            <img
              src={driver.profilePicture}
              alt="Pfp"
              className="w-40 h-40 object-cover"
            />
          ) : (
            ""
          )}

          <label>Select Profile Picture</label>
          <motion.input
            type="file"
            name="profilePicture"
            onChange={handleFileChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-transform transform focus:scale-105"
          />
          {["name", "busName", "route", "email", "mob"].map((name) => (
            <motion.input
              key={name}
              type="text"
              name={name}
              value={driver[name as keyof DriverDetails]}
              onChange={handleChange}
              placeholder={name.toUpperCase()}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-transform transform focus:scale-105"
              whileFocus={{ scale: 1.05 }}
            />
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <motion.button
            onClick={() => navigate("/dashboard/driver-manager")}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ❌ Cancel
          </motion.button>
          <motion.button
            ref={buttonRef}
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            💾 Save Changes
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditDriver;
