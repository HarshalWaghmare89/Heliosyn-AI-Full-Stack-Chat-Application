import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, logoutUser } from "../../services/authService";

const AuthContext = createContext();

//--->> AUTH REDIRECT STORAGE KEY

const AUTH_REDIRECT_KEY = "heliosyn_auth_redirect";

//-->> SAVE CURRENT LOCATION FOR AUTH REDIRECT

const saveAuthRedirect = () => {
  const pathname = window.location.pathname;
  const search = window.location.search;
  const hash = window.location.hash;

  if (pathname.startsWith("/share/")) {
    const redirectUrl = `${pathname}${search}${hash}`;

    sessionStorage.setItem(AUTH_REDIRECT_KEY, redirectUrl);
  }
};

//--->>>> AUTH PROVIDER

export function AuthProvider({ children }) {
  //--->>> USER STATE

  const [user, setUserState] = useState(null);

  //---->>> AUTH INITIALIZATION

  const [isAuthLoading, setIsAuthLoading] = useState(true);

  //----->> AUTH MODAL STATE

  const isAuthModalOpen = !isAuthLoading && !user;

  //--->>>> AUTH MODAL MODE

  const [authMode, setAuthMode] = useState("login");

  //--->>> CHECK CURRENT USER

  const checkAuth = async () => {
    try {
      const response = await getCurrentUser();

      if (response.success && response.user) {
        setUserState(response.user);
      } else {
        setUserState(null);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Authentication check failed:", error);
      }

      if (error.response?.status === 401) {
        saveAuthRedirect();
      }

      setUserState(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  //---->>> INITIAL AUTH CHECK

  useEffect(() => {
    checkAuth();
  }, []);

  //---->> SET USER

  const setUser = (newUser) => {
    setUserState(newUser);
  };

  //--->>> OPEN AUTH MODAL

  const openAuthModal = () => {
    saveAuthRedirect();

    setAuthMode("login");
  };

  //--->>> CLOSE AUTH MODAL

  const closeAuthModal = () => {};

  //---->>> LOGOUT

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUserState(null);
    }
  };

  //---->>> CONTEXT VALUE

  const value = {
    //--->>> Authentication status
    user,
    setUser,
    isAuthLoading,

    //--->> Modal
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,

    //--->> Auth mode
    authMode,
    setAuthMode,

    //--->>> Logout
    logout,

    //--->>> Re-check authentication
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

//---->> USE AUTH HOOK

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
