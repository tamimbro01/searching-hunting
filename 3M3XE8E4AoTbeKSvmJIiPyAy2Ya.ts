import { appBuilder } from "@turbofy-ai/app-runtime/dsl";
import { leadDiscoveryBlock } from "../block-types/index.js";

export const leadScoutHome = appBuilder.page({
  id: "3M3XE8E4AoTbeKSvmJIiPyAy2Ya",
  name: "LeadScout Home",
  blocks: [
    appBuilder.block({
      id: "3M3XEGPezW1tReFh5zBRI2SJYXQ",
      type: leadDiscoveryBlock,
    }),
  ],
});
