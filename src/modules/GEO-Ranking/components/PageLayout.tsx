import React from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import { Header } from "./Header";
import { SubNavBar } from "./SubNavBar";
import { MainBody } from "./MainBody";

const GeoRankingLayout: React.FC = () => {
  const theme = useAppSelector((state) => state.theme);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.bg_color || "hsl(var(--background))" }}
    >
      <Header />
      <SubNavBar />
      <MainBody>
        <Outlet />
      </MainBody>
    </div>
  );
};

export default GeoRankingLayout;
