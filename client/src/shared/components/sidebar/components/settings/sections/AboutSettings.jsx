import favicon from "../../../../../../assets/favicon.png";

const features = [
  "AI conversations",
  "Multiple Gemini models",
  "Chat history",
  "Rename, pin & archive chats",
  "Delete & temporary chats",
  "Share conversations",
  "Formatted code & mathematics",
  "Copy AI responses",
  "Keyboard shortcuts",
  "Automatic chat scrolling",
  "Email/password authentication",
  "Google OAuth",
  "Responsive UI",
];

const technologies = [
  {
    label: "Frontend",
    value: "React.js, Vite, Tailwind CSS",
  },
  {
    label: "Backend",
    value: "Node.js, Express.js",
  },
  {
    label: "Database",
    value: "MongoDB",
  },
  {
    label: "AI",
    value: "Google Gemini API",
  },
  {
    label: "Authentication",
    value: "JWT & Google OAuth",
  },
  {
    label: "HTTP Client",
    value: "Axios",
  },
];

const AboutSettings = () => {
  return (
    <div className="w-full max-w-3xl">
      {/* APP IDENTITY */}

      <div className="mb-8 flex flex-col items-center text-center sm:items-start sm:text-left">
        <div
          className="
            mb-4
            flex
            h-16
            w-16
            items-center
            justify-center
            overflow-hidden
            rounded-2xl
            border
            border-neutral-800
            bg-neutral-900
            shadow-lg
          "
        >
          <img
            src={favicon}
            alt="Heliosyn AI logo"
            className="
              h-full
              w-full
              object-contain
              p-2
            "
          />
        </div>

        <h1
          className="
            text-2xl
            font-semibold
            tracking-tight
            text-white
            sm:text-3xl
          "
        >
          Heliosyn AI
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-neutral-400
            sm:text-base
          "
        >
          An AI-powered conversational platform.
        </p>
      </div>

      {/* ABOUT PROJECT */}

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-white">
          About Heliosyn AI
        </h2>

        <p
          className="
            text-sm
            leading-7
            text-neutral-400
            sm:text-base
          "
        >
          Heliosyn AI is a full-stack AI chat application that allows users to
          communicate with Gemini AI models through a simple and responsive
          interface. It also provides tools to organize, manage, share, and
          format conversations.
        </p>
      </section>

      {/* FEATURES */}

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-white">Main Features</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature}
              className="
                rounded-xl
                border
                border-neutral-800
                bg-neutral-900/40
                px-4
                py-3
                text-sm
                text-neutral-300
                transition
                hover:border-neutral-700
                hover:bg-neutral-900/70
              "
            >
              {feature}
            </div>
          ))}
        </div>
      </section>

      {/* AI MODELS */}

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-white">AI Models</h2>

        <div
          className="
            rounded-xl
            border
            border-neutral-800
            bg-neutral-900/40
            p-5
          "
        >
          <p className="mb-3 text-sm text-neutral-400">
            Heliosyn AI currently supports three Gemini models:
          </p>

          <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-300">
            <li>gemini-3.5-flash</li>
            <li>gemini-3.6-flash</li>
            <li>gemini-3.5-flash-lite</li>
          </ul>
        </div>
      </section>

      {/* WHAT THIS PROJECT DEMONSTRATES */}

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-white">
          What This Project Demonstrates
        </h2>

        <div
          className="
            rounded-xl
            border
            border-neutral-800
            bg-neutral-900/40
            p-5
          "
        >
          <ul className="list-disc space-y-2.5 pl-5 text-sm leading-6 text-neutral-400">
            <li>
              Building a complete full-stack React and Node.js application.
            </li>
            <li>Connecting frontend and backend APIs.</li>
            <li>Integrating external AI services.</li>
            <li>Implementing authentication and protected routes.</li>
            <li>Using JWT and Google OAuth.</li>
            <li>Managing application data with MongoDB.</li>
            <li>Processing and rendering formatted AI responses.</li>
            <li>Handling API errors and user requests.</li>
            <li>Building a responsive and user-friendly interface.</li>
          </ul>
        </div>
      </section>

      {/* TECHNOLOGY STACK */}

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Technology Stack
        </h2>

        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-neutral-800
            bg-neutral-900/40
          "
        >
          <div className="divide-y divide-neutral-800">
            {technologies.map((technology) => (
              <div
                key={technology.label}
                className="
                  flex
                  flex-col
                  gap-1
                  px-4
                  py-3
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:gap-4
                "
              >
                <span className="text-sm text-neutral-500">
                  {technology.label}
                </span>

                <span className="text-sm text-neutral-200 sm:text-right">
                  {technology.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREATOR & DEVELOPER */}

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Creator & Developer
        </h2>

        <div
          className="
            rounded-2xl
            border
            border-neutral-800
            bg-neutral-900/40
            p-5
            sm:p-6
          "
        >
          {/* PROFILE */}

          <div className="mb-5 flex items-center gap-4">
            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-violet-500/10
                text-xl
                font-semibold
                text-violet-400
                ring-1
                ring-violet-500/20
              "
            >
              H
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-semibold text-white">
                Harshal Waghmare
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                Creator & Full Stack Developer
              </p>
            </div>
          </div>

          {/* DESCRIPTION */}

          <p
            className="
              text-sm
              leading-7
              text-neutral-400
              sm:text-base
            "
          >
            Heliosyn AI was created by Harshal Waghmare as a practical
            full-stack project to learn and apply modern AI and software
            development concepts. The project brings together AI integration,
            frontend development, backend APIs, authentication, database
            management, and responsive UI design in one complete application.
          </p>

          <p
            className="
              mt-4
              text-sm
              leading-7
              text-neutral-400
              sm:text-base
            "
          >
            The project was built to gain hands-on experience in designing,
            developing, testing, and deploying a real-world AI application.
          </p>

          {/* LINKS */}

          <div className="my-6 h-px bg-neutral-800" />

          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.linkedin.com/in/harshalwaghmare"
              target="_blank"
              rel="noopener noreferrer"
              className="
                rounded-lg
                border
                border-neutral-700
                px-4
                py-2
                text-xs
                font-medium
                text-neutral-300
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              LinkedIn
            </a>

            <a
              href="https://github.com/harshalwaghmare89"
              target="_blank"
              rel="noopener noreferrer"
              className="
                rounded-lg
                border
                border-neutral-700
                px-4
                py-2
                text-xs
                font-medium
                text-neutral-300
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              GitHub
            </a>

            <a
              href="https://github.com/HarshalWaghmare89/Heliosyn-AI-Full-Stack-Chat-Application"
              target="_blank"
              rel="noopener noreferrer"
              className="
                rounded-lg
                border
                border-violet-500/30
                bg-violet-500/10
                px-4
                py-2
                text-xs
                font-medium
                text-violet-300
                transition
                hover:bg-violet-500/20
              "
            >
              Project Repository
            </a>
          </div>

          {/* SIGNATURE */}

          <p
            className="
              mt-6
              text-right
              text-xs
              italic
              text-neutral-500
            "
          >
            Built with purpose. — Harshal Waghmare
          </p>
        </div>
      </section>

      {/*  APPLICATION INFORMATION */}

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-white">
          Application Information
        </h2>

        <div
          className="
            divide-y
            divide-neutral-800
            overflow-hidden
            rounded-xl
            border
            border-neutral-800
            bg-neutral-900/40
          "
        >
          <div className="flex justify-between gap-4 px-4 py-3">
            <span className="text-sm text-neutral-400">Version</span>

            <span className="text-sm text-neutral-200">1.0.0</span>
          </div>

          <div className="flex justify-between gap-4 px-4 py-3">
            <span className="text-sm text-neutral-400">Platform</span>

            <span className="text-sm text-neutral-200">Heliosyn AI</span>
          </div>

          <div className="flex justify-between gap-4 px-4 py-3">
            <span className="text-sm text-neutral-400">Project Type</span>

            <span className="text-right text-sm text-neutral-200">
              Full-Stack AI Application
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <div
        className="
          border-t
          border-neutral-800
          pt-6
          text-center
          sm:text-left
        "
      >
        <p className="text-xs text-neutral-500">
          © {new Date().getFullYear()} Heliosyn AI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AboutSettings;
