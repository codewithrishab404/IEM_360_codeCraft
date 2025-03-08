import { useEffect } from "react";
import { useNavigate } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import background from "../assets/background.jpg";
import Navbar from "./Navbar";

AOS.init();

function Home() {
  const navigate = useNavigate();

  const handleAuthButtonClick = (authType: "login" | "signup") => {
    navigate("/auth", { state: { authMode: authType } });
  };

  useEffect(() => {
    AOS.init();
  }, []);

  const user = localStorage.getItem("user");

  return (
    <div
      className="w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Navbar onAuthButtonClick={handleAuthButtonClick} />

      <section className="w-full h-[90vh] flex justify-center items-center">
        <div className="content w-2/5 text-center text-gray-200 ml-[-20px]">
          <h1
            data-aos="fade-right"
            data-aos-duration="2000"
            data-aos-delay="900"
            className="text-5xl font-bold"
            style={{ textShadow: "0 0 10px black" }}
          >
            Efficient Bus{" "}
            <span
              className="text-red-600 text-5xl font-bold"
              style={{ textShadow: "0 0 4px white" }}
            >
              Driver
            </span>{" "}
            for <br />
            Safe{" "}
            <span
              className="text-[#4d2be2] text-5xl font-bold"
              style={{ textShadow: "0 0 4px white" }}
            >
              Management
            </span>{" "}
            and Timely Journeys.
          </h1>
          <p
            data-aos="fade-left"
            data-aos-duration="2000"
            data-aos-delay="1000"
            className="w-[60%] mx-[20%] my-5 text-[18px]"
          >
            Optimizing Bus Driver Schedules for Enhanced Efficiency and
            Passenger Safety Every Journey.
          </p>
          {user && (
            <button
              data-aos="zoom-in"
              data-aos-duration="2000"
              data-aos-delay="1200"
              className="w-2/5 h-[7vh] rounded-lg bg-red-600 border-none outline-none text-white cursor-pointer text-xl font-bold transition ease-linear hover:scale-110 hover:bg-transparent hover:backdrop-brightness-50 hover:text-white hover:border-solid hover:border"
              onClick={() => navigate("/dashboard/")}
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
