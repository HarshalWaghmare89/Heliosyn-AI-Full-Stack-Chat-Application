import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Link2, Loader2 } from "lucide-react";

import { getSharedChat } from "../services/chatService";
import { useAuth } from "../shared/context/AuthContext";

import MessageRenderer from "../shared/components/chat/MessageRenderer";
import logo from "../assets/favicon.png";

const SharedChatPage = () => {
  const { shareId } = useParams();
  const location = useLocation();

  const { user, isAuthLoading } = useAuth();

  const [chat, setChat] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  //---->>>> SAVE SHARE URL FOR AUTH REDIRECT

  useEffect(() => {
    if (isAuthLoading || user || !shareId) {
      return;
    }

    const returnTo = location.pathname + location.search + location.hash;

    sessionStorage.setItem("authReturnTo", returnTo);
  }, [
    shareId,
    user,
    isAuthLoading,
    location.pathname,
    location.search,
    location.hash,
  ]);

  //------->>> LOAD SHARED CHAT

  useEffect(() => {
    let cancelled = false;

    const loadSharedChat = async () => {
      // Wait until authentication initialization has completed.
      if (isAuthLoading) {
        return;
      }

      if (!shareId) {
        setError("Invalid share link.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const sharedChat = await getSharedChat(shareId);

        if (cancelled) {
          return;
        }

        if (!sharedChat) {
          throw new Error("Shared conversation not found.");
        }

        setChat(sharedChat);
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error("Load Shared Chat Error:", requestError);

        const status = requestError?.response?.status;

        if (status === 404) {
          setError(
            "This shared conversation does not exist or sharing has been disabled.",
          );
        } else if (status === 400) {
          setError("This share link is invalid.");
        } else {
          setError(
            requestError?.response?.data?.message ||
              requestError?.message ||
              "Unable to load this shared conversation.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadSharedChat();

    return () => {
      cancelled = true;
    };
  }, [shareId, user, isAuthLoading]);

  //----->>> PAGE TITLE

  const pageTitle = chat?.title
    ? `${chat.title} — Heliosyn AI`
    : "Shared conversation — Heliosyn AI";

  //------>>>> LOADING

  if (isLoading || isAuthLoading) {
    return (
      <>
        <Helmet>
          <title>Loading shared conversation — Heliosyn AI</title>
        </Helmet>

        <main
          className="
            flex
            min-h-dvh
            items-center
            justify-center
            bg-black
            px-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              text-sm
              text-neutral-400
            "
          >
            <Loader2 size={18} className="animate-spin" />
            Loading shared conversation...
          </div>
        </main>
      </>
    );
  }

  //----->> ERROR

  if (error || !chat) {
    return (
      <>
        <Helmet>
          <title>Shared conversation — Heliosyn AI</title>
        </Helmet>

        <main
          className="
            flex
            min-h-dvh
            items-center
            justify-center
            bg-black
            px-4
            overflow-x-hidden
    custom-scrollbar
          "
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              border
              border-neutral-800
              bg-[#171717]
              p-6
              text-center
              shadow-2xl
            "
          >
            <div
              className="
                mx-auto
                mb-4
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-neutral-800
              "
            >
              <Link2 size={21} className="text-neutral-400" />
            </div>

            <h1
              className="
                text-lg
                font-semibold
                text-white
              "
            >
              Unable to open conversation
            </h1>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-neutral-400
              "
            >
              {error || "This shared conversation is unavailable."}
            </p>

            <Link
              to="/"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-violet-600
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-violet-500
              "
            >
              <ArrowLeft size={16} />
              Go to Heliosyn AI
            </Link>
          </div>
        </main>
      </>
    );
  }

  const messages = Array.isArray(chat.messages) ? chat.messages : [];

  //------->>>> SUCCESS

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <main
        className="
          min-h-dvh
          bg-black
          text-neutral-200
          overflow-x-hidden
    custom-scrollbar
        "
      >
        {/* ----->>>> HEADER */}

        <header
          className="
            sticky
            top-0
            z-20
            border-b
            border-neutral-800
            bg-black/90
            backdrop-blur-xl
          "
        >
          <div
            className="
              mx-auto
              flex
              min-h-16
              w-full
              max-w-5xl
              items-center
              justify-between
              gap-4
              px-4
              py-3
              sm:px-6
            "
          >
            {/*---->>> Brand */}

            <Link
              to="/"
              className="
                flex
                min-w-0
                items-center
                gap-3
              "
            >
              <img
                src={logo}
                alt="Heliosyn AI"
                className="
                  h-8
                  w-8
                  shrink-0
                  rounded-full
                "
              />

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  Heliosyn AI
                </p>

                <p
                  className="
                    text-xs
                    text-neutral-500
                  "
                >
                  Shared conversation
                </p>
              </div>
            </Link>

            {/*------>>> Home */}

            <Link
              to="/"
              className="
                flex
                shrink-0
                items-center
                gap-2
                rounded-xl
                border
                border-neutral-800
                px-3
                py-2
                text-xs
                font-medium
                text-neutral-300
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              <ArrowLeft size={15} />

              <span className="hidden sm:inline">Back to Heliosyn</span>
            </Link>
          </div>
        </header>

        {/* ------->>>> CONTENT */}

        <div
          className="
            mx-auto
            w-full
            max-w-4xl
            px-3
            py-6
            sm:px-5
            sm:py-8
          "
        >
          {/*----->>>> Chat information */}

          <section
            className="
              mb-8
              border-b
              border-neutral-800
              pb-6
            "
          >
            <h1
              className="
                break-words
                text-xl
                font-semibold
                tracking-tight
                text-white
                sm:text-2xl
              "
            >
              {chat.title || "Shared conversation"}
            </h1>

            <p
              className="
                mt-2
                text-xs
                text-neutral-500
              "
            >
              Shared publicly through a secure link.
            </p>
          </section>

          {/*----->>>> Messages */}

          <section aria-label="Shared conversation messages" className="w-full">
            {messages.length === 0 ? (
              <div
                className="
                  rounded-2xl
                  border
                  border-neutral-800
                  bg-[#111111]
                  p-6
                  text-center
                "
              >
                <p
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  This conversation has no messages.
                </p>
              </div>
            ) : (
              <div className="w-full">
                {messages.map((message) => (
                  <MessageRenderer
                    key={message._id || message.id}
                    message={{
                      ...message,
                      id: message._id || message.id,
                      createdAt:
                        message.createdAt ||
                        message.created_at ||
                        message.timestamp,
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default SharedChatPage;
