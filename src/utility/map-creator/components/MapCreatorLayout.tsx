import { Outlet } from "react-router-dom";
import { MapCreatorHeader } from "./MapCreatorHeader";
import { MapCreatorSubNavBar } from "./MapCreatorSubNavBar";
import { MapCreatorMainBody } from "./MapCreatorMainBody";

export const MapCreatorLayout = () => {
  return (
    <div className="min-h-screen w-full">
      <MapCreatorHeader />
      <MapCreatorSubNavBar />
      <MapCreatorMainBody>
        <Outlet />
      </MapCreatorMainBody>
    </div>
  );
};
