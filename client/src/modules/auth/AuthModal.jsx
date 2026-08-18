import { useEffect, useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../shared/context/AuthContext";

import {
  loginUser,
  registerUser,
  loginWithGoogle,
} from "../../services/authService";

import googlelogo from "../../assets/googlelogo.webp";

const AuthModal = () => {
  const { isAuthModalOpen, authMode, setAuthMode, setUser } = useAuth();

  //---->> LOCAL STATE
  const [showPassword, setShowPassword] = useState(false);

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    general: "",
  });

  //----->>>> AUTH MODE

  const isSignup = authMode === "signup";

  //---->> Used only for disabling other controls
  const isSubmitting = isFormSubmitting || isGoogleSubmitting;

  //----->>> RESET FORM WHEN AUTH MODE CHANGES

  useEffect(() => {
    setShowPassword(false);

    setIsFormSubmitting(false);
    setIsGoogleSubmitting(false);

    setErrors({
      name: "",
      email: "",
      password: "",
      general: "",
    });

    //----->>> Signup should always start with an empty form.
    if (authMode === "signup") {
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setIsSuccessMessage(false);
    }
  }, [authMode]);

  //----->>> RESET FORM WHEN AUTH MODAL OPENS

  useEffect(() => {
    if (!isAuthModalOpen) {
      return;
    }

    setFormData({
      name: "",
      email: "",
      password: "",
    });

    setErrors({
      name: "",
      email: "",
      password: "",
      general: "",
    });

    setShowPassword(false);
    setIsFormSubmitting(false);
    setIsGoogleSubmitting(false);
    setIsSuccessMessage(false);
  }, [isAuthModalOpen]);

  //---->>> LOCK BODY SCROLL

  useEffect(() => {
    if (!isAuthModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isAuthModalOpen]);

  //----->>>> DO NOT RENDER IF CLOSED

  if (!isAuthModalOpen) {
    return null;
  }

  //---->> INPUT CHANGE

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    //---->>> Clear only the current field error and general message.
    setErrors((previous) => ({
      ...previous,
      [name]: "",
      general: "",
    }));

    setIsSuccessMessage(false);
  };

  //----->>> VALIDATE NAME

  const validateName = () => {
    if (!isSignup) {
      return "";
    }

    const name = formData.name.trim();

    if (!name) {
      return "Please enter your full name.";
    }

    if (name.length < 2) {
      return "Your name must be at least 2 characters.";
    }

    if (name.length > 50) {
      return "Your name must be less than 50 characters.";
    }

    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

    if (!namePattern.test(name)) {
      return "Please enter a valid full name.";
    }

    return "";
  };

  //---->>>>> VALIDATE EMAIL

  const validateEmail = () => {
    const email = formData.email.trim();

    if (!email) {
      return "Please enter your email address.";
    }

    if (email.length > 254) {
      return "Your email address is too long.";
    }

    const emailPattern =
      /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

    if (!emailPattern.test(email)) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  //---->>> VALIDATE PASSWORD

  const validatePassword = () => {
    const password = formData.password;

    if (!password) {
      return "Please enter your password.";
    }

    if (password.length < 8) {
      return "Your password must be at least 8 characters.";
    }

    if (password.length > 128) {
      return "Your password must be less than 128 characters.";
    }

    //---->> Signup password requirements
    if (isSignup) {
      if (!/[A-Z]/.test(password)) {
        return "Your password needs at least one uppercase letter.";
      }

      if (!/[a-z]/.test(password)) {
        return "Your password needs at least one lowercase letter.";
      }

      if (!/[0-9]/.test(password)) {
        return "Your password needs at least one number.";
      }
    }

    return "";
  };

  //---->>> VALIDATE FORM

  const validateForm = () => {
    const nameError = validateName();
    const emailError = validateEmail();
    const passwordError = validatePassword();

    const newErrors = {
      name: nameError,
      email: emailError,
      password: passwordError,
      general: "",
    };

    setErrors(newErrors);
    setIsSuccessMessage(false);

    return !nameError && !emailError && !passwordError;
  };

  //---->>> API ERROR HANDLING

  const getApiErrorMessage = (error, action) => {
    //--->> BACKEND RESPONDED

    if (error?.response) {
      const status = error.response.status;
      const data = error.response.data;

      const backendMessage =
        typeof data?.message === "string" ? data.message.trim() : "";

      //---->> SIGNUP

      if (action === "signup") {
        switch (status) {
          case 400:
            return (
              backendMessage ||
              "Please check the information you entered and try again."
            );

          case 409:
            return (
              backendMessage ||
              "An account with this email already exists. Please log in instead."
            );

          case 422:
            return (
              backendMessage ||
              "Some of the information you entered is invalid."
            );

          case 429:
            return "Too many signup attempts. Please wait a moment and try again.";

          default:
            break;
        }
      }

      //---->>> LOGIN

      if (action === "login") {
        switch (status) {
          case 400:
            return (
              backendMessage ||
              "Please check your email and password and try again."
            );

          case 401:
            return "The email or password you entered is incorrect.";

          case 403:
            return (
              backendMessage ||
              "Your account is currently unavailable. Please contact support."
            );

          case 404:
            return "We couldn't find an account with this email. Please sign up first.";

          case 429:
            return "Too many login attempts. Please wait a moment and try again.";

          default:
            break;
        }
      }

      //---->>> GOOGLE AUTH

      if (action === "google") {
        switch (status) {
          case 400:
            return (
              backendMessage ||
              "We couldn't start Google sign-in. Please try again."
            );

          case 401:
          case 403:
            return (
              backendMessage ||
              "Google sign-in was unsuccessful. Please try again."
            );

          case 409:
            return (
              backendMessage ||
              "This email is already associated with another account."
            );

          case 429:
            return "Too many sign-in attempts. Please wait a moment and try again.";

          default:
            break;
        }
      }

      //--->> SERVER ERROR

      if (status >= 500) {
        return "We're having trouble completing your request right now. Please try again later.";
      }

      //--->>> BACKEND MESSAGE FALLBACK

      if (backendMessage) {
        return backendMessage;
      }

      return "We couldn't complete your request. Please try again.";
    }

    //---->> REQUEST WAS SENT BUT NO RESPONSE

    if (error?.request) {
      return "We couldn't reach the server right now. Please check your internet connection and try again.";
    }

    //---->>> UNEXPECTED ERROR

    return "Something went wrong while processing your request. Please try again.";
  };

  //--->>>> EMAIL LOGIN / SIGNUP

  const handleSubmit = async (event) => {
    event.preventDefault();

    //--->> Do not allow form authentication if another authentication action is running.
    if (isFormSubmitting || isGoogleSubmitting) {
      return;
    }

    //--->>> VALIDATE

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    //--->>> START FORM LOADING

    setIsFormSubmitting(true);

    setErrors((previous) => ({
      ...previous,
      general: "",
    }));

    setIsSuccessMessage(false);

    try {
      //---->>> SIGNUP

      if (isSignup) {
        const response = await registerUser({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });

        //---->>> Account creation was successful.
        if (!response?.success) {
          throw new Error(
            response?.message || "Unable to create your account.",
          );
        }

        const registeredEmail = formData.email.trim().toLowerCase();

        //--->>> SWITCH TO LOGIN

        setAuthMode("login");

        //---->>> Keep the email so the user does not have to type it again.
        setFormData({
          name: "",
          email: registeredEmail,
          password: "",
        });

        //---->>> SUCCESS MESSAGE

        setErrors({
          name: "",
          email: "",
          password: "",
          general:
            "Your account was created successfully. Please log in to continue.",
        });

        setIsSuccessMessage(true);

        return;
      }

      //----->>> LOGIN

      const response = await loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      //------>>> VALIDATE LOGIN RESPONSE

      if (!response?.success || !response?.user) {
        throw new Error(
          response?.message || "Unable to log in to your account.",
        );
      }

      //---->>> UPDATE GLOBAL AUTH STATE

      setUser(response.user);

      //--->>> AuthModal should close automatically when AuthContext receives the user.
    } catch (error) {
      console.error(isSignup ? "Signup Error:" : "Login Error:", error);

      const errorMessage = getApiErrorMessage(
        error,
        isSignup ? "signup" : "login",
      );

      setErrors({
        name: "",
        email: "",
        password: "",
        general: errorMessage,
      });

      setIsSuccessMessage(false);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  //---->>>> GOOGLE LOGIN

  const handleGoogleAuth = () => {
    if (isFormSubmitting || isGoogleSubmitting) {
      return;
    }

    setIsGoogleSubmitting(true);

    setErrors({
      name: "",
      email: "",
      password: "",
      general: "",
    });

    setIsSuccessMessage(false);

    try {
      //--->> Browser redirects to backend Google OAuth.
      loginWithGoogle();
    } catch (error) {
      console.error("Google Authentication Error:", error);

      const errorMessage = getApiErrorMessage(error, "google");

      setErrors({
        name: "",
        email: "",
        password: "",
        general: errorMessage,
      });

      setIsSuccessMessage(false);
      setIsGoogleSubmitting(false);
    }
  };

  //--->>> SWITCH AUTH MODE

  const switchAuthMode = () => {
    if (isSubmitting) {
      return;
    }

    setIsSuccessMessage(false);

    setErrors({
      name: "",
      email: "",
      password: "",
      general: "",
    });

    setFormData({
      name: "",
      email: "",
      password: "",
    });

    setAuthMode(isSignup ? "login" : "signup");
  };

  //---->> RENDER

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        min-h-screen
        items-center
        justify-center
        bg-black/75
        px-4
        backdrop-blur-md
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="
          relative
          w-full
          max-w-[430px]
          rounded-2xl
          border
          border-neutral-800
          bg-[#171717]
          px-6
          py-7
          shadow-[0_20px_70px_rgba(0,0,0,0.55)]
        "
      >
        {/*----->>>> HEADER */}

        <div className="mb-7 text-center">
          <h2
            id="auth-modal-title"
            className="text-xl font-semibold tracking-tight text-white"
          >
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            {isSignup
              ? "Create your Heliosyn AI account to continue."
              : "Log in to continue to Heliosyn AI."}
          </p>
        </div>

        {/*------->>>> GENERAL MESSAGE */}

        {errors.general && (
          <div
            className={`
              mb-4
              rounded-lg
              border
              px-3
              py-2.5
              text-sm
              ${
                isSuccessMessage
                  ? "border-green-500/20 bg-green-500/10 text-green-400"
                  : "border-red-500/20 bg-red-500/10 text-red-400"
              }
            `}
            role="alert"
          >
            {errors.general}
          </div>
        )}

        {/*----->>> GOOGLE AUTH */}

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isSubmitting}
          className="
            flex
            h-11
            w-full
            cursor-pointer
            items-center
            justify-center
            gap-3
            rounded-xl
            border
            border-neutral-700
            bg-[#1f1f1f]
            text-sm
            font-medium
            text-white
            transition-all
            duration-200
            hover:border-neutral-600
            hover:bg-[#252525]
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <span
            className="
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              bg-white
            "
          >
            <img
              src={googlelogo}
              alt="Google"
              className="h-5 w-5 rounded-full object-contain"
            />
          </span>

          {isGoogleSubmitting ? "Please wait..." : "Continue with Google"}
        </button>

        {/*--->>> DIVIDER */}

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-800" />

          <span className="text-xs font-medium text-neutral-600">OR</span>

          <div className="h-px flex-1 bg-neutral-800" />
        </div>

        {/*----->>> AUTH FORM */}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/*------------>>>>> FULL NAME */}

          {isSignup && (
            <div>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                autoComplete="name"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={`
                  h-11
                  w-full
                  rounded-xl
                  border
                  bg-[#111]
                  px-3
                  text-sm
                  text-white
                  outline-none
                  transition-all
                  duration-200
                  placeholder:text-neutral-600
                  focus:ring-2
                  disabled:cursor-not-allowed
                  disabled:opacity-50

                  ${
                    errors.name
                      ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/10"
                      : "border-neutral-800 focus:border-violet-500/50 focus:ring-violet-500/10"
                  }
                `}
              />

              {errors.name && (
                <p id="name-error" className="mt-1.5 px-1 text-xs text-red-400">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          {/*------------>>>>> EMAIL */}

          <div>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              autoComplete={isSignup ? "email" : "username"}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`
                h-11
                w-full
                rounded-xl
                border
                bg-[#111]
                px-3
                text-sm
                text-white
                outline-none
                transition-all
                duration-200
                placeholder:text-neutral-600
                focus:ring-2
                disabled:cursor-not-allowed
                disabled:opacity-50

                ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/10"
                    : "border-neutral-800 focus:border-violet-500/50 focus:ring-violet-500/10"
                }
              `}
            />

            {errors.email && (
              <p id="email-error" className="mt-1.5 px-1 text-xs text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/*------->>>> PASSWORD */}

          <div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className={`
                  h-11
                  w-full
                  rounded-xl
                  border
                  bg-[#111]
                  px-3
                  pr-11
                  text-sm
                  text-white
                  outline-none
                  transition-all
                  duration-200
                  placeholder:text-neutral-600
                  focus:ring-2
                  disabled:cursor-not-allowed
                  disabled:opacity-50

                  ${
                    errors.password
                      ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/10"
                      : "border-neutral-800 focus:border-violet-500/50 focus:ring-violet-500/10"
                  }
                `}
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                disabled={isSubmitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="
                  absolute
                  right-2
                  top-1/2
                  flex
                  h-8
                  w-8
                  -translate-y-1/2
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-lg
                  text-neutral-500
                  transition-all
                  duration-200
                  hover:bg-neutral-800
                  hover:text-neutral-200
                  active:scale-95
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {errors.password && (
              <p
                id="password-error"
                className="mt-1.5 px-1 text-xs text-red-400"
              >
                {errors.password}
              </p>
            )}

            {isSignup && !errors.password && (
              <p className="mt-1.5 px-1 text-[11px] text-neutral-600">
                Use at least 8 characters with uppercase, lowercase, and a
                number.
              </p>
            )}
          </div>

          {/*------>>>> FORM SUBMIT */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              h-11
              w-full
              cursor-pointer
              rounded-xl
              bg-violet-600
              text-sm
              font-semibold
              text-white
              shadow-[0_8px_20px_rgba(124,58,237,0.15)]
              transition-all
              duration-200
              hover:bg-violet-500
              hover:shadow-[0_8px_25px_rgba(124,58,237,0.25)]
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isFormSubmitting
              ? "Please wait..."
              : isSignup
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        {/*---->>> SWITCH LOGIN / SIGNUP */}

        <div className="mt-6 text-center text-sm text-neutral-500">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={switchAuthMode}
                disabled={isSubmitting}
                className="
                  cursor-pointer
                  font-medium
                  text-violet-400
                  transition-colors
                  hover:text-violet-300
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={switchAuthMode}
                disabled={isSubmitting}
                className="
                  cursor-pointer
                  font-medium
                  text-violet-400
                  transition-colors
                  hover:text-violet-300
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
