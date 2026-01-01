// Theme utility functions for loading and applying theme from localStorage

export const applyStoredTheme = () => {
  const storedTheme = localStorage.getItem("theme_customization");
  if (!storedTheme) return;

  try {
    const themeData = JSON.parse(storedTheme);

    // Apply sidebar colors immediately
    document.documentElement.style.setProperty(
      "--sidebar-bg",
      themeData.bg_color
    );
    document.documentElement.style.setProperty(
      "--sidebar-text",
      themeData.label_color
    );
    document.documentElement.style.setProperty(
      "--sidebar-active-bg",
      themeData.active_menu_bg_color
    );
    document.documentElement.style.setProperty(
      "--sidebar-active-text",
      themeData.active_menu_label_color
    );
    // Apply sidebar border color if provided, otherwise use default
    if (themeData.sidebar_border_color) {
      document.documentElement.style.setProperty(
        "--sidebar-border",
        themeData.sidebar_border_color
      );
    }

    // Apply hover styles (keep hover background as default for now)
    document.documentElement.style.setProperty(
      "--sidebar-hover-bg",
      "rgba(255, 255, 255, 0.1)"
    );

    // Apply sidebar hover text color if provided, otherwise use default
    if (themeData.sidebar_hover_text_color) {
      document.documentElement.style.setProperty(
        "--sidebar-hover-text",
        themeData.sidebar_hover_text_color
      );
    }

    // Apply accent color for public reports
    if (themeData.accent_color) {
      document.documentElement.style.setProperty(
        "--accent-color",
        themeData.accent_color
      );
    }

    // Update favicon if provided
    if (themeData.favicon) {
      const faviconLink = document.querySelector(
        "link[rel='icon']"
      ) as HTMLLinkElement;
      if (faviconLink) {
        faviconLink.href = themeData.favicon;
      } else {
        // Create favicon link if it doesn't exist
        const link = document.createElement("link");
        link.rel = "icon";
        link.href = themeData.favicon;
        document.head.appendChild(link);
      }
    }
  } catch (error) {
    console.error("Error applying stored theme:", error);
  }
};

export const clearStoredTheme = () => {
  localStorage.removeItem("theme_customization");
};
