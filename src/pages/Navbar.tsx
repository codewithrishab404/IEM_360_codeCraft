// src/components/Navbar.tsx
import React from "react";
// import { useNavigate } from "react-router";
interface NavbarProps {
  showAuthButtons?: boolean;
  isAuthRoute?: boolean;
  onHomeClick?: () => void;
  onAuthButtonClick?: (authType: "login" | "signup") => void; // ADD THIS PROP
}

const Navbar: React.FC<NavbarProps> = ({
  onAuthButtonClick,
  showAuthButtons = true,
  isAuthRoute = false,
  onHomeClick,
}) => {
  const user = localStorage.getItem("user");
  // const navigate = useNavigate();

  return (
    <nav className="w-full h-[10vh] flex justify-around items-center text-white">
      <div className="logo ml-16">
        <span className="text-[#4d2be2] text-4xl font-bold">Dr</span>
        <span className="text-red-600 text-4xl font-bold">i</span>
        <span className="text-[#4d2be2] text-4xl font-bold">ver</span>
        <span className="text-4xl font-bold">Net</span>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="links flex space-x-4 ml-14">
          <div className="link" data-aos="fade-up" data-aos-duration="1200">
            <a
              href="#"
              className="text-white no-underline text-xl hover:text-red-600"
            >
              Home
            </a>
          </div>
          <div
            className="link"
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-delay="100"
          >
            <a
              href="#"
              className="text-white no-underline text-xl hover:text-red-600"
            >
              About
            </a>
          </div>
          <div
            className="link"
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-delay="200"
          >
            <a
              href="#"
              className="text-white no-underline text-xl hover:text-red-600"
            >
              Services
            </a>
          </div>
          <div
            className="link"
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-delay="500"
          >
            <a
              href="#"
              className="text-white no-underline text-xl hover:text-red-600"
            >
              Feedback
            </a>
          </div>
          <div
            className="link"
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-delay="600"
          >
            <a
              href="#"
              className="text-white no-underline text-xl hover:text-red-600"
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      {isAuthRoute ? (
        // For the Auth route: show a single Home button.
        <div className="buttons w-64 flex justify-center items-center mr-10">
          <button
            data-aos="fade-up"
            data-aos-duration="1200"
            className="mx-1 w-2/5 h-[5vh] rounded-md border-none outline-none text-xl font-bold text-white bg-red-600 transition ease-linear hover:scale-110 hover:bg-transparent hover:backdrop-brightness-50 hover:text-white hover:border-solid hover:border"
            onClick={onHomeClick}
          >
            Home
          </button>
        </div>
      ) : (
        // Otherwise, if desired, show the Login and Sign Up buttons.
        showAuthButtons && (
          <div className="buttons w-64 flex justify-center items-center mr-16">
            {!user ? (
              <>
                <button
                  data-aos="fade-up"
                  data-aos-duration="1200"
                  data-aos-delay="800"
                  className="mx-1 w-2/5 h-[5vh] rounded-md border-none outline-none text-xl font-bold text-white bg-red-600 transition ease-linear hover:scale-110 hover:bg-transparent hover:backdrop-brightness-50 hover:text-white hover:border-solid hover:border"
                  onClick={() => onAuthButtonClick?.("login")}
                >
                  Login
                </button>
                <button
                  data-aos="fade-up"
                  data-aos-duration="1200"
                  data-aos-delay="900"
                  className="mx-1 w-2/5 h-[5vh] rounded-md border-none outline-none text-xl font-bold text-white bg-red-600 transition ease-linear hover:scale-110 hover:bg-transparent hover:backdrop-brightness-50 hover:text-white hover:border-solid hover:border"
                  onClick={() => onAuthButtonClick?.("signup")}
                >
                  Sign up
                </button>
              </>
            ) : (
              <div className="text-xl font-bold text-white">
                Welcome, {JSON.parse(user).fullName}
              </div>
            )}
          </div>
        )
      )}
    </nav>
  );
};

export default Navbar;
