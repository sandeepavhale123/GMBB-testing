export const saveNavigationState = (currentPath: string) => {
  const shouldSavePath =
    !currentPath.startsWith("/login") &&
    !currentPath.startsWith("/onboarding") &&
    currentPath !== "/";

  if (shouldSavePath) {
    console.log("Saving path for restoration:", currentPath);
    sessionStorage.setItem("post_refresh_path", currentPath);
    sessionStorage.setItem("scrollY", window.scrollY.toString());
  } else {
    console.log("Not saving path for:", currentPath);
    sessionStorage.removeItem("post_refresh_path");
    sessionStorage.removeItem("scrollY");
  }
};

export const restoreNavigationState = (
  navigate: (path: string, options?: any) => void
) => {
  const pathToRedirect = sessionStorage.getItem("post_refresh_path");
  const scrollY = sessionStorage.getItem("scrollY");

  if (pathToRedirect) {
    console.log("Navigating to saved path:", pathToRedirect);
    sessionStorage.removeItem("post_refresh_path");
    navigate(pathToRedirect, { replace: true });
  }

  if (scrollY) {
    sessionStorage.removeItem("scrollY");
    setTimeout(() => window.scrollTo(0, parseInt(scrollY, 10)), 50);
  }
};

export const getStoredTokenData = () => {
  const refreshToken = localStorage.getItem("refresh_token");
  const userId = localStorage.getItem("userId");
  return { refreshToken, userId };
};
