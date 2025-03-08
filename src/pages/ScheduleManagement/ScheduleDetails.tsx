import { app } from "@/firebase";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import gsap from "gsap";
import bgImage from "@/assets/background.jpg";

import { QRCodeSVG } from "qrcode.react";
// import { jsPDF } from "jspdf";

interface Schedule {
  id: string;
  busName: string;
  driverName: string;
  startTime: string;
  endTime: string;
  route: string;
}

const ScheduleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const db = getFirestore(app);

  //qr
  const [showQr, setShowQr] = useState(false);
  const [qrContents, setQrcontents] = useState("");
  // const [pdfUrl, setPdfUrl] = useState("");

  // Refs for animations
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const contentRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  // QR generation
  useEffect(() => {
    // const now = new Date();
    const startTime = new Date();
    const endTime = new Date();
    const start = schedule?.startTime;
    const end = schedule?.endTime;
    // Parse the input HH:mm format
    if (schedule && start && end) {
      setQrcontents(`Bus: ${schedule.busName}
                    Route: ${schedule.route}
                    Driver: ${schedule.driverName}
                    Start: ${schedule.startTime}
                    End: ${schedule.endTime}
                    Price: ₹${150}
        `);

      // const doc = new jsPDF();
      // doc.text(
      //   `Bus: ${schedule.busName}
      //     Route: ${schedule.route}
      //     Driver: ${schedule.driverName}
      //     Start: ${schedule.startTime}
      //     End: ${schedule.endTime}
      //     Price: ₹${150}
      //   `,
      //   20,
      //   30
      // );

      // // Create a Blob URL for the PDF
      // const pdfBlob = doc.output("blob");
      // const pdfObjectUrl = URL.createObjectURL(pdfBlob);
      // setPdfUrl(pdfObjectUrl);

      const [startHours, startMinutes] = start.split(":").map(Number);
      const [endHours, endMinutes] = end.split(":").map(Number);

      // Set times for comparison
      startTime.setHours(startHours, startMinutes, 0, 0);
      endTime.setHours(endHours, endMinutes, 0, 0);

      // Get current time
      const currentTime = new Date();

      if (startTime <= endTime) {
        if (currentTime >= startTime && currentTime <= endTime) {
          setShowQr(true);
        }
      } else {
        if (currentTime >= startTime || currentTime <= endTime) {
          setShowQr(true);
        }
      }
    }
  }, [schedule]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!id) return;
      try {
        const scheduleDoc = await getDoc(doc(db, "schedules", id));
        if (scheduleDoc.exists()) {
          setSchedule({
            id: scheduleDoc.id,
            ...scheduleDoc.data(),
          } as Schedule);
        } else {
          console.error("Schedule not found");
        }
      } catch (error) {
        console.error("Error fetching schedule details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  // Run animation when component mounts and after data loads
  useEffect(() => {
    if (!loading && schedule && cardRef.current) {
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
  }, [loading, schedule]);

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
        onComplete: () => navigate(-1) as any,
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className="p-6 bg-mute min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
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
        ) : schedule ? (
          <>
            <div className="flex justify-between items-center">
              <h2
                ref={titleRef}
                className="text-3xl font-bold text-gray-800 mb-6 pb-3 border-gray-200"
              >
                {schedule.busName}
              </h2>
              {showQr && (
                <div className="text-center my-3">
                  <QRCodeSVG value={qrContents} size={128} className="m-2" />
                  <div>Scan to pay</div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <p
                ref={(el) => (contentRefs.current[0] = el) as any}
                className="text-gray-700 flex items-center bg-blue-50 p-3 rounded-lg"
              >
                <span className="text-blue-500 font-bold mr-2">Driver:</span>
                <span className="text-gray-800">{schedule.driverName}</span>
              </p>

              <p
                ref={(el) => (contentRefs.current[1] = el) as any}
                className="text-gray-700 flex items-center bg-purple-50 p-3 rounded-lg"
              >
                <span className="text-purple-500 font-bold mr-2">Route:</span>
                <span className="text-gray-800">{schedule.route}</span>
              </p>

              <p
                ref={(el) => (contentRefs.current[2] = el) as any}
                className="text-gray-700 flex items-center bg-green-50 p-3 rounded-lg"
              >
                <span className="text-green-500 font-bold mr-2">
                  🕒 Start Time:
                </span>
                <span className="text-gray-800">{schedule.startTime}</span>
              </p>

              <p
                ref={(el) => (contentRefs.current[3] = el) as any}
                className="text-gray-700 flex items-center bg-amber-50 p-3 rounded-lg"
              >
                <span className="text-amber-500 font-bold mr-2">
                  ⏳ End Time:
                </span>
                <span className="text-gray-800">{schedule.endTime}</span>
              </p>
            </div>

            {/* Action buttons */}
            <div
              className="mt-8 flex gap-3 justify-end"
              ref={(el) => (contentRefs.current[4] = el) as any}
            >
              <button
                onClick={() =>
                  navigate(`/dashboard/schedules/edit/${schedule.id}`)
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md"
              >
                ✏️ Edit Schedule
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600 py-10">Schedule not found.</p>
        )}
      </div>
    </div>
  );
};

export default ScheduleDetails;