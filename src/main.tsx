import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { env } from "@/lib/env";
import { initSentry } from "@/lib/sentry";
import { initPostHog } from "@/lib/posthog";

void env; // força validação Zod no boot antes de qualquer SDK
initSentry();
initPostHog();

createRoot(document.getElementById("root")!).render(<App />);
