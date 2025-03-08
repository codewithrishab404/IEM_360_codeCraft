import { app } from "@/firebase";
import { useEffect, useState, useRef } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

interface Schedule {
  id: string;
  busName: string;
  driverName: string;
  startTime: string;
  endTime: string;
  route: string;
}

const BusSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);
  const navigate = useNavigate();

  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null);
  const scheduleCardsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "schedules"));
        const scheduleData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Schedule[];
        setSchedules(scheduleData);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Header animation when component mounts
  useEffect(() => {
    const tl = gsap.timeline();

    if (titleRef.current && buttonRef.current) {
      // Initial state
      gsap.set([titleRef.current, buttonRef.current], {
        opacity: 0,
        y: -20,
      });

      // Animate title and button
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      }).to(
        buttonRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.3"
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  // Card animations when schedules are loaded
  useEffect(() => {
    if (!loading && scheduleCardsRef.current && schedules.length > 0) {
      const cards = scheduleCardsRef.current.children;

      // Reset initial state
      gsap.set(cards, {
        opacity: 0,
        y: 30,
        rotateX: 15,
        transformOrigin: "center top",
      });

      // Animate cards
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.06,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "transform",
        onComplete: () => {
          // Add hover animations after initial animation
          Array.from(cards).forEach((card) => {
            card.addEventListener("mouseenter", () => {
              gsap.to(card, {
                y: -8,
                scale: 1.02,
                boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
                duration: 0.3,
              });
            });

            card.addEventListener("mouseleave", () => {
              gsap.to(card, {
                y: 0,
                scale: 1,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                duration: 0.3,
              });
            });
          });
        },
      });
    }
  }, [schedules, loading]);

  const deleteSchedule = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this schedule?"
    );
    if (!confirmDelete) return;

    try {
      // Find card element to animate
      if (scheduleCardsRef.current) {
        const cardToDelete = Array.from(scheduleCardsRef.current.children).find(
          (el) => el.getAttribute("data-id") === id
        ) as HTMLElement;

        if (cardToDelete) {
          // Fixed: Use a regular function for onComplete that handles the async work
          gsap
            .timeline({
              onComplete: () => {
                // Use a non-async function for the callback
                deleteDoc(doc(db, "schedules", id))
                  .then(() => {
                    setSchedules((prev) =>
                      prev.filter((schedule) => schedule.id !== id)
                    );
                  })
                  .catch((error) => {
                    console.error("Error deleting schedule:", error);
                  });
              },
            })
            .to(cardToDelete, {
              scale: 1.05,
              duration: 0.2,
              ease: "back.in",
            })
            .to(cardToDelete, {
              opacity: 0,
              y: -20,
              rotateX: -20,
              scale: 0.9,
              duration: 0.4,
              ease: "power2.in",
            });

          return;
        }
      }

      // Fallback if animation doesn't work
      await deleteDoc(doc(db, "schedules", id));
      setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  return (
    <div className="p-6  min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div ref={headerRef} className="flex justify-between items-center mb-8">
          <h2 ref={titleRef} className="text-4xl font-bold text-gray-800">
            Bus Schedules
          </h2>
          <button
            ref={buttonRef}
            onClick={() => navigate("/dashboard/schedules/add-schedules")}
            className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
          >
            Add Schedule
          </button>
        </div>

        {/* Loading & Empty State */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-center text-gray-600 text-lg font-medium">
              <span className="inline-block animate-spin mr-2">⟳</span>
              Loading schedules...
            </p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="h-40 flex items-center justify-center">
            <p className="text-center text-gray-600 text-lg bg-white/50 p-6 rounded-lg shadow-sm backdrop-blur-sm">
              No schedules found. Add your first bus schedule.
            </p>
          </div>
        ) : (
          <div
            ref={scheduleCardsRef}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                data-id={schedule.id}
                className="relative bg-white/90 p-6 rounded-xl shadow-md border-l-8 border-blue-500 backdrop-blur-sm"
              >
                {/* Edit & Delete Buttons */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/schedules/edit/${schedule.id}`)
                    }
                    className="bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-700 transition-all transform hover:scale-110"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteSchedule(schedule.id)}
                    className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-700 transition-all transform hover:scale-110"
                  >
                    Delete
                  </button>
                </div>

                {/* Schedule Details */}
                <h3 className="text-xl font-bold text-gray-700 mb-3 mt-1">
                  {schedule.busName}
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600 flex items-center">
                    <span className="font-medium mr-1">Driver:</span>{" "}
                    {schedule.driverName}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <span className="font-medium mr-1">Route:</span>{" "}
                    {schedule.route}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <span className="font-medium mr-1">🕒 Start:</span>{" "}
                    {schedule.startTime}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <span className="font-medium mr-1">⏳ End:</span>{" "}
                    {schedule.endTime}
                  </p>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() =>
                    navigate(`/dashboard/schedules/${schedule.id}`)
                  }
                  className="mt-5 bg-gray-800 text-white px-4 py-2 text-sm rounded-lg hover:bg-gray-900 transition-all transform hover:-translate-y-1 hover:shadow-lg w-full"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusSchedules;