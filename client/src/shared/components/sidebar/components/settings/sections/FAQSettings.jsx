import { useState } from "react";
import { HelpCircle, Plus, Minus } from "lucide-react";

const faqItems = [
  // 1. ABOUT HELIOSYN AI

  {
    question: "What is Heliosyn AI?",
    answer: [
      "Heliosyn AI is an AI-powered chat platform.",
      "It allows users to interact with different Gemini AI models.",
      "It provides chat management, sharing, authentication, formatting, and responsive UI features.",
    ],
  },

  {
    question: "What services and features does Heliosyn AI provide?",
    answer: [
      "Create new AI conversations.",
      "Chat with different Gemini models.",
      "Rename, pin, archive, and delete chats.",
      "Share conversations through shareable links.",
      "Copy formatted AI responses.",
      "Use keyboard shortcuts and automatic scrolling.",
      "Use normal login, signup, and Google OAuth.",
      "Use the application on desktop, tablet, and mobile devices.",
    ],
  },

  {
    question: "Who can use Heliosyn AI?",
    answer: [
      "Students can use it for learning and problem solving.",
      "Developers can use it for coding and technical questions.",
      "Users can use it for general AI conversations.",
      "The interface is designed to be simple and easy to use.",
    ],
  },

  // 2. AI MODELS

  {
    question: "Which AI models does Heliosyn AI use?",
    answer: [
      "Heliosyn AI currently supports three Gemini models:",
      "gemini-3.5-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash-lite",
    ],
  },

  {
    question: "Why does Heliosyn AI provide multiple Gemini models?",
    answer: [
      "Different models can provide different levels of speed and capability.",
      "Users can select the model that best fits their task.",
      "This also makes the platform flexible for different types of conversations.",
    ],
  },

  {
    question: "Can users switch between AI models?",
    answer: [
      "Yes.",
      "Users can select another available Gemini model from the model selector.",
      "The selected model is then used for the conversation request.",
    ],
  },

  {
    question: "How does Heliosyn AI communicate with the Gemini API?",
    answer: [
      "The user sends a message through the frontend.",
      "The request is sent to the Heliosyn AI backend.",
      "The backend communicates with the Gemini API.",
      "The AI response is returned to the frontend.",
    ],
  },

  // 3. API USAGE AND LIMITS

  {
    question: "How does Heliosyn AI handle AI API calls for users?",
    answer: [
      "AI requests are sent through the backend instead of directly from the frontend.",
      "This keeps the Gemini API credentials on the server.",
      "The backend acts as the controlled communication layer between users and Gemini.",
    ],
  },

  {
    question: "How do you prevent the Gemini API limit from being exceeded?",
    answer: [
      "API requests should be controlled at the backend level.",
      "User requests can be monitored and rate-limited before reaching Gemini.",
      "API errors and usage-limit responses should be handled gracefully.",
      "Production deployment should also use suitable Gemini API quotas and limits.",
    ],
  },

  {
    question: "Why is the Gemini API key not stored in the frontend?",
    answer: [
      "Frontend code is visible to users.",
      "A secret API key must not be exposed in browser code.",
      "The key is therefore kept on the backend.",
      "The backend communicates with Gemini securely.",
    ],
  },

  {
    question: "What happens when an AI request fails?",
    answer: [
      "The backend returns an error response.",
      "The frontend handles the error and displays a user-friendly message.",
      "The application remains usable instead of crashing.",
    ],
  },

  {
    question: "How can AI usage be controlled for individual users?",
    answer: [
      "User identity can be obtained from the authenticated session.",
      "The backend can track requests for each user.",
      "Rate limits or usage quotas can then be applied per user.",
      "This helps prevent one user from consuming the entire API quota.",
    ],
  },

  // 4. AUTHENTICATION AND SECURITY

  {
    question: "How does authentication work in Heliosyn AI?",
    answer: [
      "Users can create an account using email and password.",
      "Existing users can log in using their credentials.",
      "Google OAuth is also supported.",
      "Authentication is handled through the backend.",
    ],
  },

  {
    question: "How does Google OAuth authentication work?",
    answer: [
      "The user selects Google login.",
      "The browser is redirected to the Google authentication flow.",
      "After successful authentication, the backend creates or finds the user.",
      "The authenticated session is then available to the application.",
    ],
  },

  {
    question: "How are authenticated sessions protected?",
    answer: [
      "Heliosyn AI uses JWT-based authentication.",
      "The JWT is stored in an HTTP-only cookie.",
      "The browser sends the cookie with authenticated API requests.",
      "This prevents normal frontend JavaScript from directly reading the token.",
    ],
  },

  // 5. CHAT MANAGEMENT

  {
    question: "How are conversations managed in Heliosyn AI?",
    answer: [
      "Users can create new conversations.",
      "Chats can be renamed, pinned, archived, or deleted.",
      "Users can reopen their saved conversations later.",
      "This keeps the chat history organized.",
    ],
  },

  {
    question: "What is the purpose of pinning a chat?",
    answer: [
      "Pinning keeps an important conversation easy to find.",
      "Pinned chats are shown separately for quick access.",
      "It is useful for frequently used conversations.",
    ],
  },

  {
    question: "What happens when a chat is archived?",
    answer: [
      "The chat is removed from the main chat list.",
      "The conversation is still kept in the archived section.",
      "It can be accessed again until it is deleted.",
    ],
  },

  {
    question: "Can a user share a conversation with another person?",
    answer: [
      "Yes.",
      "Heliosyn AI provides a share-chat feature.",
      "A conversation can be opened through its share link.",
      "Authentication can be required before viewing the shared conversation.",
    ],
  },

  // 6. AI RESPONSE PROCESSING

  {
    question: "How does Heliosyn AI format raw AI responses?",
    answer: [
      "The AI response is received from the backend in structured data.",
      "The frontend processes the response before displaying it.",
      "Different content such as text, code, tables, mathematics, and Markdown can be rendered appropriately.",
      "This makes the final response easier to read.",
    ],
  },

  {
    question: "How are code blocks displayed in AI responses?",
    answer: [
      "Code is detected from the formatted AI response.",
      "It is rendered separately from normal text.",
      "Users can easily read and copy the code.",
      "The formatting helps keep code readable.",
    ],
  },

  {
    question: "How are mathematical expressions displayed?",
    answer: [
      "Mathematical content is detected from the formatted response.",
      "It is rendered separately from normal text when supported.",
      "This makes equations and mathematical explanations easier to understand.",
    ],
  },

  {
    question: "How are tables handled in AI responses?",
    answer: [
      "Markdown tables are converted into a structured table UI.",
      "The table can scroll horizontally when its content is wider than the available space.",
      "This prevents large tables from breaking the page layout.",
      "The application also provides custom scrollbar styling.",
    ],
  },

  {
    question: "How does the copy feature preserve formatted responses?",
    answer: [
      "The displayed response is processed according to its content type.",
      "Text, code, and other formatted sections are handled separately.",
      "The copy feature uses the processed response so users can copy useful content easily.",
      "This provides a better experience than copying only raw API output.",
    ],
  },

  // 7. USER EXPERIENCE AND RESPONSIVE DESIGN

  {
    question: "How does Heliosyn AI keep the latest message visible?",
    answer: [
      "The chat interface automatically manages scrolling.",
      "When new messages are added, the view can move toward the latest conversation.",
      "This helps users follow the ongoing response without manually scrolling.",
    ],
  },

  {
    question: "Does Heliosyn AI support keyboard shortcuts and responsive UI?",
    answer: [
      "Yes.",
      "Keyboard shortcuts are provided for common chat actions.",
      "The interface is responsive for desktop, tablet, and mobile screens.",
      "Input and chat areas are designed to remain usable on different screen sizes.",
    ],
  },
];

const FAQSettings = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="w-full">
      {/* HEADER */}

      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-violet-500/10
              text-violet-400
              ring-1
              ring-violet-500/20
            "
          >
            <HelpCircle size={22} />
          </div>

          <div>
            <h1
              className="
                text-xl
                font-semibold
                tracking-tight
                text-white
                sm:text-2xl
              "
            >
              Frequently Asked Questions
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-neutral-400
              "
            >
              Learn how Heliosyn AI works and how its main features are
              implemented.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ LIST */}

      <div className="space-y-3">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={item.question}
              className="
                overflow-hidden
                rounded-2xl
                border
                border-neutral-800
                bg-[#171717]
                transition-all
                duration-200
              "
            >
              {/* QUESTION */}

              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="
                  flex
                  w-full
                  cursor-pointer
                  items-center
                  justify-between
                  gap-4
                  px-5
                  py-5
                  text-left
                  transition
                  hover:bg-white/[0.04]
                "
                aria-expanded={isOpen}
              >
                <span
                  className="
                    text-sm
                    font-medium
                    text-neutral-200
                    sm:text-[15px]
                  "
                >
                  {item.question}
                </span>

                <span
                  className="
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                  "
                >
                  {isOpen ? (
                    <Minus size={18} className="text-violet-400" />
                  ) : (
                    <Plus size={18} className="text-neutral-400" />
                  )}
                </span>
              </button>

              {/* ANSWER */}

              <div
                className={`
                  grid
                  transition-all
                  duration-300
                  ease-in-out

                  ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }
                `}
              >
                <div className="overflow-hidden">
                  <div
                    className="
                      px-5
                      pb-5
                      pr-12
                      text-sm
                      leading-7
                      text-neutral-400
                    "
                  >
                    <ul className="list-disc space-y-1.5 pl-5">
                      {item.answer.map((point, pointIndex) => (
                        <li key={pointIndex}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SUPPORT CARD */}

      <div
        className="
          mt-6
          flex
          flex-col
          gap-4
          rounded-2xl
          border
          border-neutral-800
          bg-neutral-900/40
          p-5
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h3
            className="
              text-sm
              font-medium
              text-white
            "
          >
            Need more help?
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-neutral-500
            "
          >
            Check the project documentation for more technical details.
          </p>
        </div>

        <button
          type="button"
          className="
            flex
            h-10
            cursor-pointer
            items-center
            justify-center
            rounded-xl
            border
            border-neutral-700
            bg-neutral-900
            px-5
            text-sm
            font-medium
            text-neutral-200
            transition-all
            duration-200
            hover:bg-white/5
            hover:text-white
            active:scale-[0.98]
          "
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default FAQSettings;
