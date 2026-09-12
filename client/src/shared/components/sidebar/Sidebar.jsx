import { useState } from "react";

import Logo from "./Logo";
import NewChatButton from "./NewChatButton";
import SearchBox from "./SearchBox";
import PinnedChats from "./PinnedChats";
import ChatHistory from "./ChatHistory";
import SidebarFooter from "./SidebarFooter";

import PinnedChatsCard from "./PinnedChatsCard";
import RecentChatsCard from "./RecentChatsCard";
import ProfileCard from "./ProfileCard";

import SettingsModal from "../sidebar/components/settings/SettingsModal";

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,

  isMobileSidebarOpen,
  setIsMobileSidebarOpen,

  onOpenSearch,
  onNewChat,
  onOpenLogoutPopup,
}) => {
  //--->>> SIDEBAR DISPLAY STATE

  const sidebarCollapsed = isMobileSidebarOpen ? false : isCollapsed;

  // FLOATING CARD STATE
  // ONLY ONE CAN OPEN AT A TIME

  const [openFloatingCard, setOpenFloatingCard] = useState(null);

  const [isProfileOpen, setProfileOpen] = useState(false);

  const [isSettingsOpen, setSettingsOpen] = useState(false);

  //--->> TOGGLE FLOATING CARD

  const toggleFloatingCard = (card) => {
    setOpenFloatingCard((current) => (current === card ? null : card));
  };

  return (
    <>
      {/* SIDEBAR */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50

          flex
          h-dvh
          flex-col

          border-r
          border-neutral-800

          bg-black
          text-white

          transition-all
          duration-300

          w-[260px]

          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}


          md:static
          md:translate-x-0

          ${sidebarCollapsed ? "md:w-14" : "md:w-[260px]"}
        `}
      >
        {/* LOGO */}

        <Logo
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={(value) => {
            setIsCollapsed(value);

            if (isMobileSidebarOpen && value === true) {
              setIsMobileSidebarOpen(false);
            }
          }}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* ACTIONS */}

        <div
          className={`
            ${
              !sidebarCollapsed
                ? "space-y-3 border-b border-neutral-800 pb-3"
                : ""
            }
          `}
        >
          <NewChatButton isCollapsed={sidebarCollapsed} onNewChat={onNewChat} />

          <SearchBox
            isCollapsed={sidebarCollapsed}
            onOpenSearch={onOpenSearch}
          />
        </div>

        {/* CHAT AREA */}

        <div
          className={`
            min-h-0
            flex-1

            ${
              !sidebarCollapsed
                ? "custom-scrollbar overflow-y-auto"
                : "overflow-visible"
            }
          `}
        >
          <PinnedChats
            isCollapsed={sidebarCollapsed}
            onOpenPinnedChats={() => toggleFloatingCard("pinned")}
          />

          <ChatHistory
            isCollapsed={sidebarCollapsed}
            onOpenRecentChats={() => toggleFloatingCard("recent")}
          />
        </div>

        {/* FOOTER */}

        <SidebarFooter
          isCollapsed={sidebarCollapsed}
          onOpenProfile={() => setProfileOpen(true)}
        />
      </aside>

      {/* FLOATING CARDS */}

      <PinnedChatsCard
        isOpen={openFloatingCard === "pinned"}
        onClose={() => setOpenFloatingCard(null)}
      />

      <RecentChatsCard
        isOpen={openFloatingCard === "recent"}
        onClose={() => setOpenFloatingCard(null)}
      />

      <ProfileCard
        isOpen={isProfileOpen}
        onClose={() => setProfileOpen(false)}
        onOpenSettings={() => {
          setProfileOpen(false);

          setSettingsOpen(true);
        }}
        onLogout={() => {
          setProfileOpen(false);

          onOpenLogoutPopup?.();
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};

export default Sidebar;
