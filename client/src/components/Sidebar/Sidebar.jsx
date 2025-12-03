import {
  Home,
  UserPlus,
  History,
  ListVideo,
  Heart,
  TvMinimalPlay,
  UserRoundCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const sidebarItems = [
  { icon: Home, label: "Home", id: "home" },
  { icon: UserPlus, label: "Subscriptions", id: "subscriptions" },
];

const sidebarLibrary = [
  {
    icon: History,
    label: "Watched Videos",
    id: "history",
    path: "/watch-history",
  },
  {
    icon: ListVideo,
    label: "Playlists",
    id: "playlists",
    path: "/watch-history",
  },
  { icon: Heart, label: "Liked Videos", id: "liked", path: "/watch-history" },
];

const channelLibrary = [
  {
    icon: TvMinimalPlay,
    label: "Your Channel",
    id: "your-channel",
    path: "/your-channel",
  },
  {
    icon: UserRoundCheck,
    label: "Followers",
    id: "followers",
    path: "/followers",
  },
];

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  return (
    <>
      {/* Overlay with fade animation */}
      <div
        className={`fixed inset-x-0 top-12 md:top-20 bottom-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <aside
        className={`h-[calc(100vh-3rem)] md:h-[calc(100vh-5rem)] w-80 bg-[#003C43] dark:bg-[#002f34] text-white border-r-[0.5px] border-white/30 fixed top-12 md:top-20 z-40 ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <div className="pt-4 pl-4 pr-4">
          {sidebarItems.map((item) => {
            return (
              <Link
                key={item.id}
                to={"/"}
                className="flex items-center gap-6 hover:bg-[#135D66] px-3 py-4 rounded-lg transition"
                onClick={closeSidebar}
              >
                <item.icon className="w-8 h-8" />
                <span className="block text-[1.3rem] font-semibold">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        <hr className="ml-6 mr-6 mt-10 mb-6 text-white/30" />
        <div className="pt-4 pl-4 pr-4">
          {sidebarLibrary.map((item) => {
            return (
              <Link
                key={item.id}
                to={item.path}
                className="flex items-center gap-6 hover:bg-[#135D66] px-3 py-4 rounded-lg transition "
                onClick={closeSidebar}
              >
                <item.icon className="w-8 h-8" />
                <span className="block text-[1.3rem] font-semibold">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <hr className="ml-6 mr-6 mt-10 mb-6 text-white/30" />
        <div className="pt-4 pl-4 pr-4">
          {channelLibrary.map((item) => {
            return (
              <Link
                key={item.id}
                to={item.path}
                className="flex items-center gap-6 hover:bg-[#135D66] px-3 py-4 rounded-lg transition "
                onClick={closeSidebar}
              >
                <item.icon className="w-8 h-8" />
                <span className="block text-[1.3rem] font-semibold">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
