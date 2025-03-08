import { useState, useEffect, useRef } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { app } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { MdOutlineAdd } from "react-icons/md";
import { Input } from "@/components/ui/input";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

interface Driver {
  name: string;
  busName: string;
  mob: string;
  uid: string;
  email: string;
}

const AddDriver = () => {
  const [busName, setBusName] = useState("");
  // const [driverId, setDriverId] = useState("");
  const [driverPassword, setDriverPassword] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverEmail, setDriverEmail] = useState("");
  const [driverMobileNumber, setDriverMobileNumber] = useState("");
  const [route, setRoute] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const db = getFirestore(app);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const user = localStorage.getItem("user");

  const auth = getAuth(app);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file); // Convert to Base64

    reader.onload = () => {
      const base64String = reader.result as string;
      setProfilePicture(base64String);
    };

    reader.onerror = (error) =>
      console.error("Base64 conversion error:", error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !busName ||
      !driverPassword ||
      !driverEmail ||
      !driverMobileNumber ||
      !driverName ||
      !route ||
      !profilePicture
    ) {
      alert("Please fill all fields and upload a profile picture.");
      return;
    }
    let driverExist = false;
    drivers.forEach((d) => {
      if (driverEmail === d.email) driverExist = true;
    });
    if (!driverExist) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          driverEmail,
          driverPassword
        );
        await updateProfile(userCredential.user, { displayName: driverName });
        const docRef = doc(db, "drivers", userCredential.user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(doc(db, "drivers", userCredential.user.uid), {
            uid: userCredential.user.uid,
            name: driverName,
            email: driverEmail,
            mob: driverMobileNumber,
            busName,
            route,
            profilePicture,
            adminUid: JSON.parse(user as string).uid,
          });
          console.log("User added successfully!");
          navigate("/dashboard/driver-manager");
        } else {
          console.log("User already exists!");
          alert("Driver with this id already exist!");
        }
      } catch (error) {
        console.error("Error adding driver:", error);
      }
    }
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "drivers"));
        const driversData = querySnapshot.docs.map((doc) => ({
          name: doc.get("name"),
          email: doc.get("email"),
          busName: doc.get("busName"),
          mob: doc.get("mob"),
          uid: doc.get("uid"),
          // ...doc.data(),
        })) as Driver[];
        setDrivers(driversData);
        console.log(driversData);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };
    fetchDrivers();
  }, []);

  if (!user || JSON.parse(user).role !== "admin")
    return (
      <>
        <div className="text-red-500 text-3xl text-center p-5">
          Please log in as admin to add drivers!
        </div>
      </>
    );

  return (
    <div className="p-6 min-h-screen flex items-center justify-center">
      <motion.form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg border-l-4 border-blue-500"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg mb-6 hover:bg-gray-900 transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <span>←</span> Back
        </button>
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-6 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          👲 Add a new Driver
        </motion.h2>

        <div className="grid gap-4">
          {[
            {
              placeholder: "Driver Name",
              value: driverName,
              setter: setDriverName,
            },
            {
              placeholder: "Driver Password",
              value: driverPassword,
              setter: setDriverPassword,
            },
            {
              placeholder: "Driver Email",
              value: driverEmail,
              setter: setDriverEmail,
            },
            {
              placeholder: "Driver Mobile number",
              value: driverMobileNumber,
              setter: setDriverMobileNumber,
            },
            { placeholder: "Bus Name", value: busName, setter: setBusName },
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
          <div className="mt-4">Upload Driver profile photo</div>
          {profilePicture !== "" ? (
            <div className="w-40 h-40 object-cover">
              <img src={profilePicture} alt="Profile Picture" />
            </div>
          ) : (
            ""
          )}
          <Input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <motion.button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-6 w-full hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-center gap-3 items-center">
            {<MdOutlineAdd size={24} />} Add Driver
          </div>
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddDriver;
