import { Settings, Palette, Shield, Sparkles } from "lucide-react";

import ArchivedChatsSettings from "./sections/ArchivedChatsSettings";
import FAQSettings from "./sections/FAQSettings";
import AboutSettings from "./sections/AboutSettings";

const SettingsContent = ({ activeSection }) => {
  const sectionClass = `
    w-full
    p-4
    sm:p-5
    md:p-6
    lg:p-7
  `;

  //--->> REUSABLE EMPTY STATE

  const renderEmptyState = ({
    icon: Icon,
    title,
    description,
    emptyTitle,
    emptyDescription,
  }) => (
    <div className={sectionClass}>
      {/* HEADING */}

      <div className="w-full">
        <h2
          className="
            text-lg
            font-semibold
            leading-tight
            tracking-tight
            text-white
            sm:text-xl
            md:text-2xl
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            max-w-2xl
            text-xs
            leading-5
            text-neutral-400
            sm:text-sm
            sm:leading-6
          "
        >
          {description}
        </p>
      </div>

      {/* EMPTY STATE */}

      <div
        className="
          flex
          w-full
          flex-col
          items-center
          justify-center
          px-4
          py-12
          text-center
          sm:py-14
          md:py-16
        "
      >
        {/* ICON */}

        <div
          className="
            mb-3
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-neutral-800
            bg-neutral-900/60
            text-neutral-600
            sm:h-12
            sm:w-12
          "
        >
          <Icon size={24} strokeWidth={1.7} className="sm:h-7 sm:w-7" />
        </div>

        {/* EMPTY TITLE */}

        <h3
          className="
            text-sm
            font-medium
            leading-5
            text-neutral-300
            sm:text-base
          "
        >
          {emptyTitle}
        </h3>

        {/* EMPTY DESCRIPTION */}

        <p
          className="
            mt-1
            max-w-[280px]
            text-xs
            leading-5
            text-neutral-500
            sm:max-w-sm
            sm:text-sm
            sm:leading-6
          "
        >
          {emptyDescription}
        </p>
      </div>
    </div>
  );

  switch (activeSection) {
    case "general":
      return renderEmptyState({
        icon: Settings,

        title: "General",

        description: "Manage basic application preferences and settings.",

        emptyTitle: "No general settings",

        emptyDescription: "General application preferences will appear here.",
      });

    //---->>> PERSONALIZATION

    case "personalization":
      return renderEmptyState({
        icon: Palette,

        title: "Personalization",

        description: "Customize your Heliosyn AI experience.",

        emptyTitle: "No personalization options",

        emptyDescription: "Personalization options will appear here.",
      });

    //---->>> ARCHIVED CHATS

    case "archived":
      return (
        <div className={sectionClass}>
          <ArchivedChatsSettings />
        </div>
      );

    //--->> DATA CONTROLS

    case "data-controls":
      return renderEmptyState({
        icon: Shield,

        title: "Data Controls",

        description: "Manage your chat data, storage, and privacy preferences.",

        emptyTitle: "No data controls",

        emptyDescription: "Data and privacy controls will appear here.",
      });

    //--->>> FAQ

    case "faq":
      return (
        <div className={sectionClass}>
          <FAQSettings />
        </div>
      );

    //--->>> ABOUT

    case "about":
      return (
        <div className={sectionClass}>
          <AboutSettings />
        </div>
      );

    //---->>> FALLBACK

    default:
      return renderEmptyState({
        icon: Sparkles,

        title: "Settings",

        description: "Manage your Heliosyn AI preferences.",

        emptyTitle: "Select a settings category",

        emptyDescription:
          "Choose an option from the sidebar to view its settings.",
      });
  }
};

export default SettingsContent;
