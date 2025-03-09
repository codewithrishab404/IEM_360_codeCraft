// App.tsx (or Auth.tsx)
import React, { useState } from "react";
import "../css/auth.css";
import { useLocation, useNavigate } from "react-router";
import Navbar from "./Navbar";
import background from "../assets/background.jpg";
import { app } from "../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const Auth: React.FC = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();
  const location = useLocation();
  const defaultAuthMode = location.state?.authMode === "signup";
  const [isRegisterActive, setIsRegisterActive] = useState(defaultAuthMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRegisterClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsRegisterActive(true);
    setError(null);
  };

  const handleLoginClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsRegisterActive(false);
    setError(null);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isRegisterActive) {
        // Admin Registration
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Update Firebase Profile
        await updateProfile(user, { displayName: fullName });

        const adminData = {
          fullName: fullName,
          email: user.email,
          createdAt: new Date().toISOString(),
        };

        // Store admin details in Firestore
        await setDoc(doc(db, "admins", user.uid), {
          fullName: fullName,
          email: user.email,
          createdAt: new Date().toISOString(),
        });

        localStorage.setItem(
          "user",
          JSON.stringify({ uid: user.uid, role: "admin", ...adminData })
        );

        alert("Admin Registration successful!");
        navigate("/dashboard");
      } else {
        // Login for both Admins & Drivers
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Check if the user is an Admin
        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          const adminData = adminSnap.data();
          localStorage.setItem(
            "user",
            JSON.stringify({ uid: user.uid, role: "admin", ...adminData })
          );
          navigate("/dashboard");
          alert("Admin login successful!");
          navigate("/dashboard");
          return;
        }

        // Check if the user is a Driver
        const driverRef = doc(db, "drivers", user.uid);
        const driverSnap = await getDoc(driverRef);

        if (driverSnap.exists()) {
          const driverData = driverSnap.data();
          localStorage.setItem(
            "user",
            JSON.stringify({
              uid: user.uid,
              role: "driver",
              id: driverData.id,
              ...driverData,
            })
          );
          alert("Driver login successful!");
          navigate("/dashboard");
          return;
        }

        // If user is not found in either collection
        setError("Unauthorized access. Please contact the admin.");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Navbar isAuthRoute={true} onHomeClick={handleHomeClick} />
      <div className="flex-grow flex items-center justify-center">
        <div className={`wrapper ${isRegisterActive ? "active" : ""}`}>
          <span className="bg-animate"></span>
          <span className="bg-animate2"></span>
          <div className="form-box login">
            <h2
              className="animation"
              style={{ "--i": 0, "--j": 21 } as React.CSSProperties}
            >
              Login
            </h2>
            <form onSubmit={handleAuth}>
              <div
                className="input-box animation"
                style={{ "--i": 1, "--j": 22 } as React.CSSProperties}
              >
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>Email</label>
                <i className="bx bxs-user"></i>
              </div>
              <div
                className="input-box animation"
                style={{ "--i": 2, "--j": 23 } as React.CSSProperties}
              >
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>Password</label>
                <i className="bx bxs-lock-alt"></i>
              </div>
              {error && <p className="error-message">{error}</p>}
              <button
                type="submit"
                className="btn animation"
                style={{ "--i": 3, "--j": 24 } as React.CSSProperties}
              >
                Login
              </button>
              <div
                className="logreg-link animation"
                style={{ "--i": 4, "--j": 25 } as React.CSSProperties}
              >
                <p>
                  Want to register as an Admin?{" "}
                  <a
                    href="#"
                    className="register-link"
                    onClick={handleRegisterClick}
                  >
                    Sign Up
                  </a>
                </p>
              </div>
            </form>
          </div>

          <div className="info-text login">
            <h2
              className="animation"
              style={{ "--i": 0, "--j": 19 } as React.CSSProperties}
            >
              Welcome Back!
            </h2>
            <p
              className="animation"
              style={{ "--i": 1, "--j": 20 } as React.CSSProperties}
            >
              Hope, You and your Family have a Great Day
            </p>
          </div>

          {/* Register Form */}
          <div className="form-box register">
            <h2
              className="animation"
              style={{ "--i": 17, "--j": 0 } as React.CSSProperties}
            >
              Admin Sign Up
            </h2>
            <form onSubmit={handleAuth}>
              <div
                className="input-box animation"
                style={{ "--i": 18, "--j": 1 } as React.CSSProperties}
              >
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <label>Full name</label>
                <i className="bx bxs-user"></i>
              </div>
              <div
                className="input-box animation"
                style={{ "--i": 19, "--j": 2 } as React.CSSProperties}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>Email</label>
                <i className="bx bxs-envelope"></i>
              </div>
              <div
                className="input-box animation"
                style={{ "--i": 20, "--j": 3 } as React.CSSProperties}
              >
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>Password</label>
                <i className="bx bxs-lock-alt"></i>
              </div>
              {error && <p className="error-message">{error}</p>}
              <button
                type="submit"
                className="btn animation"
                style={{ "--i": 21, "--j": 4 } as React.CSSProperties}
              >
                Register
              </button>
              <div
                className="logreg-link animation"
                style={{ "--i": 22, "--j": 5 } as React.CSSProperties}
              >
                <p>
                  Already have an account?{" "}
                  <a href="#" className="login-link" onClick={handleLoginClick}>
                    Login
                  </a>
                </p>
              </div>
            </form>
          </div>

          <div className="info-text register">
            <h2
              className="animation"
              style={{ "--i": 17, "--j": 0 } as React.CSSProperties}
            >
              Welcome!
            </h2>
            <p
              className="animation"
              style={{ "--i": 18, "--j": 1 } as React.CSSProperties}
            >
              Hope, You have a <br />
              Great Day
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
