import { Link } from "react-router-dom";

export const MapCreatorSubNavBar = () => {
  return (
    <div className="fixed top-[64px] z-40 w-full border-b bg-background">
      <div className="flex h-12 items-center px-4 md:px-6">
        <nav className="flex items-center gap-6">
          <Link
            to="/utility/map-creator"
            className="text-sm font-medium text-primary border-b-2 border-primary pb-1"
          >
            Map Creator
          </Link>
        </nav>
      </div>
    </div>
  );
};
