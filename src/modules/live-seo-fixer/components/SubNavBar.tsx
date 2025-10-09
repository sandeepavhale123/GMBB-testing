import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export const SubNavBar: React.FC = () => {
  const navItems = [
    {
      to: "/module/live-seo-fixer/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      to: "/module/live-seo-fixer/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 py-4 border-b-2 transition-colors",
                  isActive
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
