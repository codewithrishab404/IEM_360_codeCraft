import { app } from "@/firebase";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore";
import gsap from "gsap";

interface DriverDetails {
  id: string;
  name: string;
  busName: string;
  route: string;
  email: string;
  mob: string;
  profilePicture: string;
}

const DriverDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [driverDetails, setDriverDetails] = useState<DriverDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const db = getFirestore(app);

  // Refs for animations
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const contentRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const fetchDriver = async () => {
      if (!id) return;
      try {
        const driverDoc = await getDoc(doc(db, "drivers", id));
        if (driverDoc.exists()) {
          setDriverDetails({
            id: driverDoc.id,
            ...driverDoc.data(),
          } as DriverDetails);
        } else {
          console.error("Driver not found");
        }
      } catch (error) {
        console.error("Error fetching driver details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [id]);

  // Delete driver
  const handleDelete = async () => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    if (user.role !== "admin") {
      if (!window.confirm("Are you sure you want to delete this driver?"))
        return;
      try {
        setLoading(true);
        await deleteDoc(doc(db, "drivers", id as string));
        navigate(`/dashboard/driver-manager`);
      } catch (err) {
        console.error("Cannot delete driver: ", err);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Log in as admin to delete a driver!");
    }
  };

  // Run animation when component mounts and after data loads
  useEffect(() => {
    if (!loading && driverDetails && cardRef.current) {
      // Initial states
      gsap.set(cardRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.95,
        rotationX: 10,
        transformPerspective: 800,
      });

      if (backButtonRef.current) {
        gsap.set(backButtonRef.current, { opacity: 0, x: -20 });
      }

      if (titleRef.current) {
        gsap.set(titleRef.current, { opacity: 0, y: -20 });
      }

      contentRefs.current.forEach((ref) => {
        if (ref) {
          gsap.set(ref, { opacity: 0, x: 20 });
        }
      });

      // Create timeline for all animations
      const tl = gsap.timeline();

      // Card entrance with 3D effect
      tl.to(cardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.8,
        ease: "power3.out",
      })

        // Back button slides in
        .to(
          backButtonRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.5"
        )

        // Title appears with slight bounce
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        )

        // Content items stagger in
        .to(
          contentRefs.current,
          {
            opacity: 1,
            x: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power1.out",
          },
          "-=0.2"
        );

      // Add hover effect to the card
      if (cardRef.current) {
        cardRef.current.addEventListener("mousemove", (e) => {
          if (!cardRef.current) return;
          const rect = cardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          // Calculate rotation based on mouse position
          const rotateY = ((mouseX - rect.width / 2) / rect.width) * 5;
          const rotateX = ((rect.height / 2 - mouseY) / rect.height) * 5;

          gsap.to(cardRef.current, {
            rotateY: rotateY,
            rotateX: rotateX,
            boxShadow: `${rotateY * -1}px ${rotateX}px 20px rgba(0,0,0,0.2)`,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        cardRef.current.addEventListener("mouseleave", () => {
          if (!cardRef.current) return;
          gsap.to(cardRef.current, {
            rotateY: 0,
            rotateX: 0,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            duration: 0.5,
            ease: "power3.out",
          });
        });
      }

      return () => {
        // Clean up animations when component unmounts
        tl.kill();
      };
    }
  }, [loading, driverDetails]);

  // Function to handle card exit animation when navigating back
  const handleBack = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        rotationX: -10,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => navigate("/dashboard/driver-manager") as any,
      });
    } else {
      navigate("/dashboard/driver-manager");
    }
  };

  return (
    <div className="p-6 min-h-screen flex items-center justify-center">
      <div
        ref={cardRef}
        className="bg-white/90 p-8 rounded-xl shadow-xl w-full max-w-lg backdrop-blur-sm border-l-8 border-blue-500 overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        <button
          ref={backButtonRef}
          onClick={handleBack}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg mb-6 hover:bg-gray-900 transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <span>←</span> Back
        </button>

        {loading ? (
          <div className="py-10 flex justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : driverDetails ? (
          <>
            <div className="flex justify-center">
              <img
                src={driverDetails.profilePicture}
                alt="Pfp"
                className="w-40 h-40 object-cover"
              />
            </div>
            <h2
              ref={titleRef}
              className="text-3xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200"
            >
              {driverDetails.name}
            </h2>

            <div className="space-y-4">
              <p
                ref={(el) => (contentRefs.current[0] = el) as any}
                className="text-gray-700 flex items-center bg-blue-50 p-3 rounded-lg"
              >
                <span className="text-blue-500 font-bold mr-2">Bus:</span>
                <span className="text-gray-800">{driverDetails.busName}</span>
              </p>

              <p
                ref={(el) => (contentRefs.current[1] = el) as any}
                className="text-gray-700 flex items-center bg-purple-50 p-3 rounded-lg"
              >
                <span className="text-purple-500 font-bold mr-2">Route:</span>
                <span className="text-gray-800">{driverDetails.route}</span>
              </p>

              <p
                ref={(el) => (contentRefs.current[2] = el) as any}
                className="text-gray-700 flex items-center bg-green-50 p-3 rounded-lg"
              >
                <span className="text-green-500 font-bold mr-2">Email:</span>
                <span className="text-gray-800">{driverDetails.email}</span>
              </p>

              <p
                ref={(el) => (contentRefs.current[3] = el) as any}
                className="text-gray-700 flex items-center bg-amber-50 p-3 rounded-lg"
              >
                <span className="text-amber-500 font-bold mr-2">
                  Mobile Number:
                </span>
                <span className="text-gray-800">{driverDetails.mob}</span>
              </p>
            </div>

            {/* Action buttons */}
            <div
              className="mt-8 flex gap-3 justify-between"
              ref={(el) => (contentRefs.current[4] = el) as any}
            >
              <button
                onClick={() => handleDelete()}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 shadow-md"
              >
                🗑️ Delete Driver
              </button>
              <button
                onClick={() => navigate(`/dashboard/driver-manager/edit/${id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md"
              >
                ✏️ Edit Driver
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600 py-10">Driver not found.</p>
        )}
      </div>
    </div>
  );
};

export default DriverDetails;
