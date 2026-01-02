import { useEffect, useState } from "react";

/**
 * Wouter-compatible location hook that uses window.location.hash.
 * Returns: [path, navigate]
 * Example path: "/day/1"
 */
export function useHashLocation(): [string, (to: string, replace?: boolean) => void] {
  const getHashPath = () => {
    const hash = window.location.hash || "#/";
    const path = hash.replace(/^#/, "");
    return path.startsWith("/") ? path : `/${path}`;
  };

  const [loc, setLoc] = useState<string>(getHashPath);

  useEffect(() => {
    const onHashChange = () => setLoc(getHashPath());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (to: string, replace = false) => {
    const next = to.startsWith("/") ? to : `/${to}`;
    const url = `#${next}`;
    if (replace) {
      // Replace current history entry
      window.location.replace(url);
    } else {
      window.location.hash = next;
    }
  };

  return [loc, navigate];
}
