"use client";

import { useEffect } from "react";
import { app } from "@/lib/firebase";

export default function FirebaseProvider() {
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const { getAnalytics, logEvent, isSupported } = await import(
          "firebase/analytics"
        );
        const supported = await isSupported();
        if (!supported || cancelled) return;
        const analytics = getAnalytics(app);
        logEvent(analytics, "page_view");
      } catch {
        // Analytics unavailable (e.g. blocked by privacy settings) — fail silently.
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
