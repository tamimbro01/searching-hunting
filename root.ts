import { appBuilder } from "@turbofy-ai/app-runtime/dsl";
import { leadDiscoveryBlock } from "../block-types/index.js";

export const root = appBuilder.page({
  name: "LeadScout Home",
  blocks: [appBuilder.block({ type: leadDiscoveryBlock })],
});
