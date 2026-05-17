"use client";

import { useEffect, useState } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

type TgUser = {
  first_name?: string;
  last_name?: string;
  username?: string;
};

type State =
  | { kind: "loading" }
  | { kind: "outside" }
  | { kind: "inside"; name: string };

function buildName(user: TgUser): string {
  const full = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return full || user.username || "друг";
}

export default function Home() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    try {
      const lp = retrieveLaunchParams();
      const user = lp.tgWebAppData?.user as TgUser | undefined;
      if (user) {
        setState({ kind: "inside", name: buildName(user) });
      } else {
        setState({ kind: "outside" });
      }
    } catch {
      setState({ kind: "outside" });
    }
  }, []);

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight">Mobility App</h1>
        <p className="mt-3 text-sm text-gray-500">
          Домашние тренировки и подвижность
        </p>

        <div className="mt-10 min-h-[2rem]">
          {state.kind === "loading" && (
            <p className="text-gray-400">Загрузка…</p>
          )}
          {state.kind === "inside" && (
            <p className="text-lg">
              Привет,{" "}
              <span className="font-semibold">{state.name}</span>!
            </p>
          )}
          {state.kind === "outside" && (
            <p className="text-lg text-gray-600">Открой через Telegram</p>
          )}
        </div>
      </div>
    </main>
  );
}
