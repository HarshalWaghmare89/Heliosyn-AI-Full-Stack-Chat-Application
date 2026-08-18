import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useChats } from "../context/ChatContext";

import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";

import SearchModal from "../components/sidebar/components/search/SearchModal";

import PinLimitPopup from "../components/popups/PinLimitPopup";
import DeleteChatPopup from "../components/popups/DeleteChatPopup";
import ShareChatPopup from "../components/popups/ShareChatPopup";
import LogoutConfirmPopup from "../components/popups/LogoutConfirmPopup";

function MainLayout() {
  const navigate = useNavigate();

  //--->>> CHAT CONTEXT

  const { startNewChat } = useChats();

  //---->>>> SIDEBAR STATES

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  //---->>>> SEARCH

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  //--->>> LOGOUT

  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);

  //--->>>> NEW CHAT

  const handleNewChat = () => {
    setIsSearchOpen(false);
    setIsMobileSidebarOpen(false);

    startNewChat();

    navigate("/");
  };

  //---->>> KEYBOARD SHORTCUTS

  useEffect(() => {
    const handleKeyboardShortcut = (event) => {
      const target = event.target;

      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      //--->>> ESC

      if (event.key === "Escape") {
        if (isSearchOpen) {
          event.preventDefault();
          setIsSearchOpen(false);
          return;
        }

        if (isMobileSidebarOpen) {
          event.preventDefault();
          setIsMobileSidebarOpen(false);
          return;
        }

        return;
      }

      //--->>> DON'T TRIGGER WHILE TYPING

      if (isTyping) {
        return;
      }

      //--->>>> PLATFORM

      const isMac = navigator.platform.toLowerCase().includes("mac");

      const primaryModifier = isMac ? event.metaKey : event.ctrlKey;

      //--->>>> CTRL/CMD + K SEARCH

      if (primaryModifier && !event.shiftKey && event.code === "KeyK") {
        event.preventDefault();
        event.stopPropagation();

        setIsSearchOpen(true);

        return;
      }

      //--->>> CTRL/CMD + SHIFT + O NEW CHAT

      if (primaryModifier && event.shiftKey && event.code === "KeyO") {
        event.preventDefault();
        event.stopPropagation();

        handleNewChat();

        return;
      }

      //--->>> CTRL/CMD + / TOGGLE SIDEBAR

      if (primaryModifier && event.code === "Slash") {
        event.preventDefault();
        event.stopPropagation();

        if (window.innerWidth < 768) {
          setIsMobileSidebarOpen((previous) => !previous);
          return;
        }

        setIsSidebarCollapsed((previous) => !previous);
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcut, true);

    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut, true);
    };
  }, [isSearchOpen, isMobileSidebarOpen, startNewChat]);

  //---->>>> SEARCH

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  //--->>> RENDER

  return (
    <div
      className="
        relative
        flex
        h-dvh
        w-full
        min-w-0
        overflow-hidden
        bg-black
        text-white
      "
    >
      {/* MOBILE OVERLAY */}

      {isMobileSidebarOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            md:hidden
          "
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        onOpenSearch={handleOpenSearch}
        onNewChat={handleNewChat}
        onOpenLogoutPopup={() => {
          setIsLogoutPopupOpen(true);
        }}
      />

      {/* MAIN APPLICATION AREA */}

      <div
        className="
          flex
          min-h-0
          min-w-0
          flex-1
          flex-col
          overflow-hidden
        "
      >
        {/* HEADER */}

        <Header
          onOpenSidebar={() => {
            setIsMobileSidebarOpen(true);
          }}
        />

        {/* PAGE */}

        <main
          className="
            min-h-0
            min-w-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
          "
        >
          <Outlet />
        </main>
      </div>

      {/* SEARCH MODAL */}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={handleCloseSearch}
        onNewChat={handleNewChat}
      />

      {/* GLOBAL POPUPS */}

      <PinLimitPopup />

      <DeleteChatPopup />

      <ShareChatPopup />

      {/* LOGOUT */}

      <LogoutConfirmPopup
        isOpen={isLogoutPopupOpen}
        onClose={() => {
          setIsLogoutPopupOpen(false);
        }}
      />
    </div>
  );
}

export default MainLayout;
