import { useEffect, useRef } from "react";

export default function useEffectSkipMount(effect: () => void, dependencies: any[]): void {
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    effect();
  }, dependencies);
}
