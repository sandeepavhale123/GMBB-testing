import React from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { Header } from "./components/Header";
import { SubNavbar } from "./components/SubNavbar";
import { MainBody } from "./components/MainBody";
import { Footer } from "./components/Footer";

export const MultiDashboardLayout: React.FC = () => {
  const theme = useAppSelector((state) => state.theme);
  useAxiosAuth(); // Initialize auth helpers for axios interceptors

  return React.createElement(
    "div",
    {
      className: "min-h-screen flex flex-col",
      style: { backgroundColor: theme.bg_color || "hsl(var(--background))" },
    },
    React.createElement(Header),
    React.createElement(SubNavbar),
    React.createElement(MainBody, null, React.createElement(Outlet)),
    React.createElement(Footer)
  );
};
