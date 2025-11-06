import { Outlet } from "react-router-dom";
import { MapCreatorHeader } from "./MapCreatorHeader";
import { MapCreatorMainBody } from "./MapCreatorMainBody";

export const MapCreatorLayout = () => {
  return (
    <div className="min-h-screen w-full">
      <MapCreatorHeader />
      <MapCreatorMainBody>
        <Outlet />
      </MapCreatorMainBody>
    </div>
  );
};
