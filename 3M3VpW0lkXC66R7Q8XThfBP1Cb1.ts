import { appBuilder } from "@turbofy-ai/app-runtime/dsl";
import { leadScoutHome } from "./3M3XE8E4AoTbeKSvmJIiPyAy2Ya.js";
import { leadDiscoveryBlock } from "../block-types/index.js";

export const home = appBuilder.page({
  id: "3M3VpW0lkXC66R7Q8XThfBP1Cb1",
  name: "Home",
  slug: "j",
  parent: leadScoutHome,
  meta: { "description": "Visit the home page to begin exploring the site from its main page in English.", "jsonLd": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"WebPage\",\n  \"name\": \"{{title}}\",\n  \"description\": \"{{description}}\"\n}\n", "keywords": "home page, main page, website home, English home page, start page", "og:description": "Visit the home page to begin exploring the site from its main page in English.", "og:title": "Home Page | Visit the Main Page and Explore the Site", "title": "Home Page | Visit the Main Page and Explore the Site", "twitter:description": "Visit the home page to begin exploring the site from its main page in English.", "twitter:title": "Home Page | Visit the Main Page and Explore the Site" },
  blocks: [
    appBuilder.block({
      id: "3M3W1GWbCRm3y4d7NPJM5ScRQe8",
      type: leadDiscoveryBlock,
      config: `(() => {
  const dt = $$std.getRecord(
    'cmsbuildingblocktype',
    $$self.buildingBlockTypeId,
    { dynamicArgs: { ...$$args, fields: ["id", "appId", "defaultConfig", "name"]} }
  ).defaultConfig;
  const bc = $$std.translate('block_'+$$self.id);
  const __colors = /*block-colors*/ {"background:solid:F6F8F5:100":{"hex":"B3D0A5","opacity":100}};
  return { ...dt, copies: { ...(dt?.copies ?? {}), ...bc }, style: { ...(dt && dt.style), colors: __colors } };
})()`,
    }),
  ],
});
