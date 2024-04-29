"use client";
import { reducerCase } from "@/context/constants";
import { stateContextProvider } from "@/context/StateContext";
import { HOST, SET_USER_IMAGE, SET_USER_INFO } from "@/utils/constants";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type } from "os";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const Profile = () => {
  const [cookies, setCookies] = useCookies();
  const router = useRouter();
  const [{ currentUser }, dispatch] = stateContextProvider();
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const [image, setImage] = useState(undefined);
  const [errMsg, setErrMsg] = useState("");
  const [userData, setuserData] = useState({
    username: "",
    fullName: "",
    description: "",
  });

  const setProfile = async () => {
    try {
      const { data } = await axios.post(SET_USER_INFO, userData, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      if (data.userError) {
        setErrMsg("Username already exists");
      } else {
        setErrMsg("");
        let imageName = "";
        if (image) {
          const formData = new FormData();
          formData.append("image", image);
          const {
            data: { img },
          } = await axios.post(SET_USER_IMAGE, formData, {
            headers: {
              "Content-Type": "multipart/form-data",

              Authorization: `Bearer ${cookies.token}`,
            },
          });
          imageName = img;
        }
        dispatch({
          type: reducerCase.SET_USER,
          user: {
            ...currentUser,
            ...data,
            image: imageName.length > 0 ? HOST + "/" + imageName : false,
          },
        });
      }
    } catch (error) {
      setErrMsg(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    const handleData = { ...userData };
    if (currentUser?.username) handleData.username = currentUser.username;
    if (currentUser?.description)
      handleData.description = currentUser.description;
    if (currentUser?.fullName) handleData.fullName = currentUser.fullName;
    if (currentUser?.imageName) {
      const fileName = image;
      fetch(currentUser?.imageName).then(async (response) => {
        const contentType = response.headers.get("content-type");
        const blob = await response.blob();
        const files = new File([blob], fileName, { contentType });
        setImage(files);
      });
    }
    setuserData(handleData);
    setIsLoaded(true);
  }, [currentUser]);

  const handleChange = (e) => {
    setuserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleFile = (e) => {
    const files = e.target.files;
    const fileType = files[0].type;
    const validTypes = ["image/gif", "image/jpeg", "image/png", "image/jpg"];
    if (validTypes.includes(fileType)) {
      setImage(files[0]);
    }
  };
  const handleLogout = () => {
    dispatch({ type: reducerCase.LOGOUT });
    setCookies("token", null);
    router.push("/");
  };
  const inputClassName =
    "block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500";
  const labelClassName =
    "mb-2 text-lg font-medium text-gray-900 dark:text-white";

  return (
    <>
      {isLoaded && (
        <div className="flex flex-col items-center justify-start min-h-[80vh] gap-3 mt-36">
          {errMsg && (
            <div>
              <span className="text-red-600 font-bold">{errMsg}</span>
            </div>
          )}
          <h2 className="text-3xl">Welcome to freelancing marketplace</h2>
          <h4 className="text-xl">
            Please complete your profile to get started
          </h4>
          <div className="flex flex-col items-center w-full gap-5">
            <div
              className="flex flex-col cursor-pointer"
              onMouseEnter={() => setImageHover(true)}
              onMouseLeave={() => setImageHover(false)}
            >
              <label className={labelClassName}>Select a profile picture</label>
              <div className="bg-purple-500 size-36 flex items-center justify-center rounded-full relative">
                {image ? (
                  <Image
                    src={currentUser?.imageName}
                    alt="Profile"
                    fill
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-6xl text-white">
                    {currentUser?.email[0].toUpperCase()}
                  </span>
                )}
                <div
                  className={`absolute bg-slate-400 h-full w-full rounded-full flex items-center justify-center   transition-all duration-100  ${
                    imageHover ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span
                    className={` flex items-center justify-center  relative`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 text-white absolute"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="file"
                      onChange={handleFile}
                      className="opacity-0"
                      multiple={true}
                      name="profileImage"
                      accept="image/*"
                    />
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-[500px] ">
              <div>
                <label className={labelClassName} htmlFor="username">
                  Please select a username
                </label>
                <input
                  type="text"
                  className={inputClassName}
                  name="username"
                  placeholder="Username"
                  value={userData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className={labelClassName} htmlFor="fullName">
                  Please enter full name
                </label>
                <input
                  type="text"
                  className={inputClassName}
                  name="fullName"
                  placeholder="Full Name"
                  value={userData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col w-[500px]">
              <label htmlFor="description" className={labelClassName}>
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={userData.description}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Description"
              ></textarea>
            </div>
            <button
              className="mb-4 border text-lg font-semibold px-5 py-3 border-green-500 bg-green-500 text-white rounded-md"
              type="button"
              onClick={setProfile}
            >
              Set Profile
            </button>
            <button
              className="mb-12 border text-lg font-semibold px-5 py-3 border-red-500 bg-red-500 text-white rounded-md"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
