import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentUser } from "../services/authService.js";
import { useAuth } from "../shared/context/AuthContext.jsx";

function OAuthSuccess() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const completeGoogleLogin = async () => {
      try {
        //----->>>> GET AUTHENTICATED USER

        const response = await getCurrentUser();

        //----->>>> VALIDATE RESPONSE

        if (!response?.success || !response?.user) {
          throw new Error("Unable to authenticate Google user.");
        }

        if (!isMounted) {
          return;
        }

        //---->>> UPDATE GLOBAL AUTH STATE

        setUser(response.user);

        //----->>>> RESTORE ORIGINAL DESTINATION

        const pendingRedirect = sessionStorage.getItem(
          "heliosyn_auth_redirect",
        );

        // Remove it immediately so it cannot accidentally affect a future login.
        sessionStorage.removeItem("heliosyn_auth_redirect");

        //---->>> REDIRECT

        if (
          pendingRedirect &&
          pendingRedirect.startsWith("/") &&
          !pendingRedirect.startsWith("//")
        ) {
          navigate(pendingRedirect, {
            replace: true,
          });

          return;
        }

        navigate("/", {
          replace: true,
        });
      } catch (error) {
        console.error("Google OAuth completion failed:", error);

        if (!isMounted) {
          return;
        }

        // Clear stale redirect information.
        sessionStorage.removeItem("heliosyn_auth_redirect");

        navigate("/", {
          replace: true,
        });
      }
    };

    completeGoogleLogin();

    return () => {
      isMounted = false;
    };
  }, [navigate, setUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111]">
      <div className="text-center">
        <div
          className="
            mx-auto
            mb-4
            h-8
            w-8
            animate-spin
            rounded-full
            border-2
            border-neutral-700
            border-t-violet-500
          "
        />

        <h2 className="text-lg font-semibold text-white">Signing you in...</h2>

        <p className="mt-2 text-sm text-neutral-500">
          Please wait while we complete your Google authentication.
        </p>
      </div>
    </div>
  );
}

export default OAuthSuccess;
