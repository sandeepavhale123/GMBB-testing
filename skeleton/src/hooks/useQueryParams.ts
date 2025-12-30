import { useLocation } from "react-router-dom";

export const useQueryParams = (paramName: string): string | null => {
  const location = useLocation();

  return getRawQueryParam(location.search, paramName);
};

const getRawQueryParam = (search: string, paramName: string): string | null => {
  const query = search.startsWith("?") ? search.substring(1) : search;
  const params = query.split("&");

  for (let param of params) {
    const eqIndex = param.indexOf("=");
    if (eqIndex === -1) continue;

    const key = param.substring(0, eqIndex);
    const value = param.substring(eqIndex + 1); // includes everything after the first "="

    if (key === paramName) {
      return value;
    }
  }

  return null;
};
