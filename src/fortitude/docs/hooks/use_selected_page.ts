import { useEffect, useState } from "react";

export function useSelectedPage<T extends string>(props: {
  basePath: string;
  defaultPage: T;
}): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [selectedPage, setSelectedPage] = useState<T>(
    getFirstSegmentAsDocLinkIfAny<T>() ?? props.defaultPage,
  );

  useEffect(() => {
    updateUrlWithoutRefresh(props.basePath, selectedPage);
  }, [selectedPage]);

  return [selectedPage, setSelectedPage];
}

export function getFirstSegmentAsDocLinkIfAny<T extends string>(): T | null {
  const pathSegments = window.location.pathname.split("/");
  const lastSegment = pathSegments[3];
  if (!lastSegment) return null;
  return decodeURIComponent(lastSegment) as T;
}

export function updateUrlWithoutRefresh(basePath: string, newSegment: string) {
  if (!newSegment) return;
  const origin = window.location.origin;
  const newUrl = `${origin}${basePath}${encodeURIComponent(newSegment)}`.toLowerCase();
  window.history.pushState({}, "", newUrl);
}
