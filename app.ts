export { schema } from "./schema.js";
import { appBuilder } from "@turbofy-ai/app-runtime/dsl";
import { leadScoutHome } from "./pages/3M3XE8E4AoTbeKSvmJIiPyAy2Ya.js";
import { home } from "./pages/3M3VpW0lkXC66R7Q8XThfBP1Cb1.js";
import { leadDiscoveryBlock } from "./block-types/index.js";

export const app = appBuilder.buildApp({
  name: "LeadScout",
  i18n: {"default":"en","locales":["en"]},
  description: "Find relevant conversations and prospects across the web.",
  color: "green",
  icon: "users",
  pages: [leadScoutHome, home],
  blockTypes: [leadDiscoveryBlock],
});
