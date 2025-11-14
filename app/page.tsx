"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/workflow");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          AgentFlow
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Loading workflow editor...
        </p>
      </div>
    </div>
  );
}
