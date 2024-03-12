import { useHistory } from "react-router-dom";

export function useRedirect() {
  const reactHistory = useHistory();
  return (url: string) => {
    reactHistory?.push?.(url);
    !reactHistory && window.location.replace(url);
  }; //fallback for development - react router not available
}
