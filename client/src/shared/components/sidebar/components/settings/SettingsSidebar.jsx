import {
  Settings,
  Palette,
  Archive,
  Shield,
  HelpCircle,
  Info,
} from "lucide-react";

const settingsItems = [
  {
    id: "general",
    label: "General",
    icon: Settings,
  },
  {
    id: "personalization",
    label: "Personalization",
    icon: Palette,
  },
  {
    id: "archived",
    label: "Archived Chats",
    icon: Archive,
  },
  {
    id: "data-controls",
    label: "Data Controls",
    icon: Shield,
  },
  {
    id: "faq",
    label: "FAQ",
    icon: HelpCircle,
  },
  {
    id: "about",
    label: "About",
    icon: Info,
  },
];

const SettingsSidebar = ({
  activeSection = "general",
  setActiveSection = () => {},
}) => {
  return (
    <div className="flex h-full flex-col">
      {/* HEADER */}

      <div
        className="
          flex-shrink-0
          border-b
          border-neutral-800
          px-3
          py-4
        "
      >
        <h2 className="text-sm font-semibold text-white">Settings</h2>
      </div>

      {/* NAVIGATION */}

      <div
        className="
          flex-1
          overflow-x-auto
          custom-scrollbar
          px-2
          py-2.5
          md:overflow-x-visible
        "
      >
        <div
          className="
            flex
            gap-1
            md:flex-col
          "
        >
          {settingsItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`
                  flex
                  flex-shrink-0
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-lg
                  px-2.5
                  py-2
                  text-xs
                  font-medium
                  transition-all
                  duration-200

                  md:mb-0.5
                  md:w-full

                  ${
                    isActive
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
                  }
                `}
              >
                <Icon size={15} strokeWidth={2} className="flex-shrink-0" />

                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
