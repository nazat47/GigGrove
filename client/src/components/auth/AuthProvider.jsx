'use client'
import React from "react";
import { stateContextProvider } from "@/context/StateContext";
import AuthWrapper from "./AuthWrapper";

const AuthProvider = () => {
  const [{ showLoginModal, showRegisterModal }] = stateContextProvider();

  return (
    <div>
      {(showLoginModal || showRegisterModal) && (
        <AuthWrapper type={showLoginModal ? "login" : "register"} />
      )}
    </div>
  );
};

export default AuthProvider;
