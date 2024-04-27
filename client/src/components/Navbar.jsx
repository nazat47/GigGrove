"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import FiverrLogo from "./FiverrLogo";
import { stateContextProvider } from "@/context/StateContext";
import { IoSearchOutline } from "react-icons/io5";
import { useRouter, usePathname } from "next/navigation";
import { useCookies } from "react-cookie";
import { GET_USER_INFO, HOST } from "@/utils/constants";
import axios from "axios";
import { reducerCase } from "@/context/constants";
import Image from "next/image";

const Navbar = () => {
  const [cookies] = useCookies();
  const [isLoaded, setIsLoaded] = useState(true);
  const [isFixed, setIsFixed] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [
    { showLoginModal, showRegisterModal, currentUser, isSeller },
    dispatch,
  ] = stateContextProvider();
  const router = useRouter();
  const pathname = usePathname();
  const handleLogin = () => {
    dispatch({
      type: reducerCase.TOGGLE_LOGIN,
      showLoginModal: true,
      showRegisterModal: false,
    });
  };
  console.log(currentUser?.imageName)
  const handleSignup = () => {
    dispatch({
      type: reducerCase.TOGGLE_REGISTER,
      showLoginModal: false,
      showRegisterModal: true,
    });
  };
  const links = [
    { linkName: "Fiverr Business", handler: "#", type: "link" },
    { linkName: "Explore", handler: "#", type: "link" },
    { linkName: "English", handler: "#", type: "link" },
    { linkName: "Become a Seller", handler: "#", type: "link" },
    { linkName: "Sign in", handler: handleLogin, type: "button" },
    { linkName: "Join", handler: handleSignup, type: "button2" },
  ];

  useEffect(() => {
    if (cookies.token && !currentUser) {
      const getUserInfo = async () => {
        try {
          const { data } = await axios.get(GET_USER_INFO, {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          });
          let projectedUser = { ...data };
          if (data.profileImage) {
            projectedUser = {
              ...projectedUser,
              imageName: HOST + "/" + data.profileImage,
            };
            delete projectedUser.image;
          }
          dispatch({ type: reducerCase.SET_USER, user: projectedUser });
          setIsLoaded(true);
          if (!data.isProfileInfoSet) {
            router.push("/profile");
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      getUserInfo();
    } else {
      setIsLoaded(true);
    }
  }, [cookies, currentUser]);

  useEffect(() => {
    if (pathname === "/") {
      const positionNavbar = () => {
        window.pageYOffset > 0 ? setIsFixed(true) : setIsFixed(false);
      };
      window.addEventListener("scroll", positionNavbar);
      return () => window.removeEventListener("scroll", positionNavbar);
    } else {
      setIsFixed(true);
    }
  }, [pathname]);

  const handleOrder = () => {
    if (isSeller) router.push("/seller/orders");
    else router.push("/buyer/orders");
  };

  const handleUserSwitch = () => {
    if (isSeller) {
      dispatch({ type: reducerCase.SWITCH_MODE });
      router.push("/buyer");
    } else {
      dispatch({ type: reducerCase.SWITCH_MODE });
      router.push("/seller");
    }
  };

  return (
    <>
      {isLoaded && (
        <nav
          className={`w-full px-24 flex justify-between items-center py-6 top-0 z-30 transition-all duration-300 ${
            isFixed || currentUser
              ? "fixed bg-white border-b border-gray-200"
              : "absolute bg-transparent border-transparent"
          }`}
        >
          <div className="">
            <Link href="/">
              <FiverrLogo
                fillColor={!isFixed && !currentUser ? "#ffffff" : "#404145"}
              />
            </Link>
          </div>
          <div
            className={`flex ${
              isFixed || !currentUser ? "opacity-100" : "opacity-0"
            }`}
          >
            <input
              type="text"
              className="w-[27rem] py-2.5 px-4 border"
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
              placeholder="What service are you looking for?"
            />
            <button
              onClick={() => {
                setSearchData("");
                router.push(`/search?q=${searchData}`);
              }}
              className="bg-gray-900 py-1.5 text-white w-16 flex items-center justify-center"
            >
              <IoSearchOutline className="fill-white text-white size-6" />
            </button>
          </div>
          {!currentUser ? (
            <ul className="flex gap-10 items-center">
              {links.map(({ linkName, handler, type }) => (
                <li
                  key={linkName}
                  className={`${
                    isFixed ? "text-base" : "text-white"
                  } font-medium`}
                >
                  {type === "link" && <Link href={handler}>{linkName} </Link>}
                  {type === "button" && (
                    <button onClick={handler}>{linkName}</button>
                  )}
                  {type === "button2" && (
                    <button
                      onClick={handler}
                      className={`border text-md font-semibold py-1 px-3 rounded-sm ${
                        isFixed
                          ? "border-[#1DBF73] text-green-600"
                          : "border-white text-white"
                      } hover:bg-green-600 hover:text-white hover:border-green-700 transition-all duration-500`}
                    >
                      {linkName}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <ul className="flex gap-10 items-center">
              {isSeller && (
                <li
                  className="cursor-pointer text-green-500 font-medium"
                  onClick={() => router.push("/seller/gigs/create")}
                >
                  Create Gig
                </li>
              )}
              <li
                className="cursor-pointer text-green-500 font-medium"
                onClick={handleOrder}
              >
                Orders
              </li>
              <li
                onClick={handleUserSwitch}
                className="cursor-pointer font-medium"
              >
                Switch to {isSeller ? "Buyer" : "Seller"}
              </li>
              <li
                className="cursor-pointer"
                onClick={(e) => {
                  router.push("/profile");
                  e.stopPropagation();
                }}
                title="Profile"
              >
                {currentUser?.imageName ? (
                  <Image
                    src={currentUser.imageName}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-purple-500 size-10 flex items-center justify-center rounded-full relative">
                    <span className="text-xl text-white">
                      {currentUser.email[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </li>
            </ul>
          )}
        </nav>
      )}
    </>
  );
};

export default Navbar;
