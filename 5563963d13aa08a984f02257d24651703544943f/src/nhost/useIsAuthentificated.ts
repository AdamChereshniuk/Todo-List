import { useNhost } from "react-nhost";

export function useIsAuthenticated() {
  const { isAuthenticated, isLoading } = useNhost();
  return { isAuthenticated, isLoading };
};