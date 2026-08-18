import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";

import logo from "../assets/favicon.png";

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found — Heliosyn AI</title>
        <meta
          name="description"
          content="The page you are looking for could not be found."
        />
      </Helmet>

      <main
        className="
          flex
          min-h-dvh
          items-center
          justify-center

          overflow-x-hidden

          bg-black
          px-4
          py-10

          text-neutral-200
        "
      >
        <div
          className="
            w-full
            max-w-lg

            text-center
          "
        >
          {/* BRAND */}

          <Link
            to="/"
            className="
              mx-auto
              mb-8

              flex
              w-fit
              items-center
              gap-3
            "
          >
            <img
              src={logo}
              alt="Heliosyn AI"
              className="
                h-9
                w-9
                rounded-full
              "
            />

            <span
              className="
                text-base
                font-semibold
                tracking-tight
                text-white
              "
            >
              Heliosyn AI
            </span>
          </Link>

          {/* ERROR ICON */}

          <div
            className="
              mx-auto
              mb-6

              flex
              h-20
              w-20

              items-center
              justify-center

              rounded-3xl

              border
              border-neutral-800

              bg-[#171717]

              shadow-[0_20px_60px_rgba(0,0,0,0.35)]
            "
          >
            <SearchX size={34} strokeWidth={1.7} className="text-neutral-500" />
          </div>

          {/* ERROR CODE */}

          <p
            className="
              text-sm
              font-medium
              tracking-[0.25em]
              text-violet-400
            "
          >
            ERROR 404
          </p>

          {/* TITLE */}

          <h1
            className="
              mt-3

              text-3xl
              font-semibold
              tracking-tight

              text-white

              sm:text-4xl
            "
          >
            Page not found
          </h1>

          {/* DESCRIPTION */}

          <p
            className="
              mx-auto
              mt-4
              max-w-md

              text-sm
              leading-6

              text-neutral-500

              sm:text-base
            "
          >
            The page you are looking for doesn't exist, has been moved, or the
            URL may be incorrect.
          </p>

          {/* ACTIONS */}

          <div
            className="
              mt-8

              flex
              flex-col
              items-center
              justify-center

              gap-3

              sm:flex-row
            "
          >
            <Link
              to="/"
              className="
                inline-flex
                h-11
                w-full

                items-center
                justify-center
                gap-2

                rounded-xl

                bg-violet-600

                px-5

                text-sm
                font-medium
                text-white

                shadow-[0_8px_25px_rgba(124,58,237,0.15)]

                transition-all
                duration-200

                hover:bg-violet-500
                hover:shadow-[0_8px_30px_rgba(124,58,237,0.25)]

                active:scale-[0.98]

                sm:w-auto
              "
            >
              <Home size={16} />
              Go to Home
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="
                inline-flex
                h-11
                w-full

                cursor-pointer

                items-center
                justify-center
                gap-2

                rounded-xl

                border
                border-neutral-800

                bg-[#171717]

                px-5

                text-sm
                font-medium
                text-neutral-300

                transition-all
                duration-200

                hover:border-neutral-700
                hover:bg-[#1f1f1f]
                hover:text-white

                active:scale-[0.98]

                sm:w-auto
              "
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>

          {/* FOOTER MESSAGE */}

          <p
            className="
              mt-10

              text-xs
              text-neutral-700
            "
          >
            Heliosyn AI · Intelligent conversations, simplified.
          </p>
        </div>
      </main>
    </>
  );
};

export default NotFoundPage;
