"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdFacebook } from "react-icons/md";
import { stateContextProvider } from "@/context/StateContext";
import { reducerCase } from "@/context/constants";
import { LOGIN_URL, SIGNUP_URL } from "../../utils/constants";
import axios from "axios";
import { useCookies } from "react-cookie";

const AuthWrapper = ({ type }) => {
  const [cookies, setCookies] = useCookies();
  const [{ showLoginModal, showRegisterModal }, dispatch] =
    stateContextProvider();
  const [values, setValues] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleClick = async () => {
    try {
      const { email, password } = values;
      if (email && password) {
        const {
          data: { user, token },
        } = await axios.post(
          type === "login" ? LOGIN_URL : SIGNUP_URL,
          { email, password },
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        );
        setCookies("token", token);
        dispatch({ type: reducerCase.CLOSE_AUTH_MODAL });
        if (user) {
          dispatch({ type: reducerCase.SET_USER, user });
        }
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed top-0 z-[100]">
      <div
        className="h-[100vh] w-[100vw] backdrop-blur-sm fixed top-0"
        id="blur-div"
      ></div>
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
        <div
          className="fixed z-[101] h-max w-max bg-white rounded-md shadow-md flex flex-col justify-center items-center"
          id="auth-modal"
        >
          <div className="flex flex-col justify-center items-center p-8 gap-7">
            <h3 className="text-2xl font-semibold text-slate-700">
              {type === "login" ? "Login to Fiverr" : "Sign up to Fiverr"}
            </h3>
            <div className="flex flex-col gap-5">
              <button className="text-white rounded-md bg-blue-500 p-3 font-semibold w-80 flex items-center justify-center relative">
                <MdFacebook className="absolute left-4 text-2xl" />
                Continue with Facebook
              </button>
              <button className="border border-slate-300 rounded-md p-3 font-medium w-80 flex items-center justify-center relative">
                <FcGoogle className="absolute left-4 text-2xl" />
                Continue with Google
              </button>
            </div>
            <div className="relative w-full text-center">
              <span className="before:content-[''] before:h-[0.5px] before:w-80 before:absolute before:top-[50%] before:left-0 before:bg-slate-400">
                <span className="bg-white relative z-10 px-2">OR</span>
              </span>
            </div>
            <div className="flex flex-col gap-5">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="border rounded-md border-slate-300 p-3 w-80"
                value={values.email}
                onChange={handleChange}
              />
              <input
                type="text"
                name="password"
                placeholder="Password"
                required
                className="border rounded-md border-slate-300 p-3 w-80"
                value={values.password}
                onChange={handleChange}
              />
              <button
                onClick={handleClick}
                className="bg-green-600 text-white px-12 text-lg font-semibold rounded-md p-3 w-80"
              >
                Continue
              </button>
            </div>
          </div>
          <div className="py-5 w-full flex items-center justify-center border-t border-slate-300 ">
            <span className="text-sm text-slate-700">
              {`${
                type === "login"
                  ? "Not a member yet? "
                  : "Already have an account? "
              }`}
              {type === "login" ? (
                <span
                  onClick={() =>
                    dispatch({
                      type: reducerCase.TOGGLE_REGISTER,
                      showRegisterModal: true,
                      showLoginModal: false,
                    })
                  }
                  className="text-green-700 cursor-pointer font-semibold"
                >
                  Join Now
                </span>
              ) : (
                <span
                  onClick={() =>
                    dispatch({
                      type: reducerCase.TOGGLE_LOGIN,
                      showLoginModal: true,
                      showRegisterModal: false,
                    })
                  }
                  className="text-green-700 cursor-pointer font-semibold"
                >
                  Login
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;
