import parser from "@typescript-eslint/parser";
import { dirname, relative, resolve, sep } from "node:path";

const importVisitors = (check) => ({
  ImportDeclaration: (node) => check(node.source),
  ExportNamedDeclaration: (node) => check(node.source),
  ExportAllDeclaration: (node) => check(node.source),
  ImportExpression: (node) => check(node.source),
  TSImportType: (node) => check(node.source),
  TSExternalModuleReference: (node) => check(node.expression),
  CallExpression: (node) => {
    if (node.callee.type === "Identifier" && node.callee.name === "require" && node.arguments.length === 1) check(node.arguments[0]);
  },
});

const staticSpecifier = (node) => {
  if (node?.type === "Literal" && typeof node.value === "string") return node.value;
  if (node?.type === "TemplateLiteral" && node.expressions.length === 0) return node.quasis[0].value.cooked;
  return undefined;
};

const moduleAlias = (path) => "@/" + path.replace(/(?:\.d)?\.[cm]?[jt]sx?$/, "").replace(/\/index$/, "");
const runtimePackage = /^(?:@turbofy-ai\/app-runtime|@graphapi-io\/app-std-lib)(?:\/(.*))?$/;
const runtimeSource = /(?:^|\/)node_modules\/(?:@turbofy-ai\/app-runtime|@graphapi-io\/app-std-lib)\/(?:dist\/)?src\/(.+)$/;
const builtInRoot = /^(?:api|components|generated|hooks|lib|navigation)(?:\/|\.[cm]?[jt]sx?$|$)/;

const runtimeModuleAlias = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      alias: 'Import "{{specifier}}" through "{{alias}}" so it resolves to the published runtime module.',
      shared: 'Import "{{specifier}}" through "{{alias}}". Re-export helpers from that shared module\'s index.',
      outsideBlock: 'Relative import "{{specifier}}" leaves block directory "{{directory}}". Keep helpers inside this directory or publish them as a shared module and use its @/shared/<Name> alias.',
      outsideShared: 'Relative import "{{specifier}}" leaves shared module directory "{{directory}}". Keep helpers inside this directory or publish them as a shared module and use its @/shared/<Name> alias.',
      package: 'Import runtime values from their @/ alias, such as @/navigation or @/api, instead of "{{specifier}}".',
    },
  },
  create(context) {
    const filename = context.filename;
    const sourcePath = relative(context.cwd, filename).split(sep).join("/");
    const owner = sourcePath.match(/^(?:block-types|shared)\/[^/]+(?=\/)/)?.[0];
    return importVisitors((node) => {
      const specifier = staticSpecifier(node);
      if (!specifier || specifier.startsWith("@/")) return;
      const packageMatch = specifier.match(runtimePackage);
      if (packageMatch) {
        const path = packageMatch[1]?.replace(/^(?:dist\/)?src\//, "");
        if (path === "dsl") return;
        if (!path) {
          context.report({ node, messageId: "package", data: { specifier } });
          return;
        }
        context.report({ node, messageId: "alias", data: { specifier, alias: moduleAlias(path) } });
        return;
      }
      if (specifier !== "." && specifier !== ".." && !specifier.startsWith("./") && !specifier.startsWith("../")) return;
      const target = relative(context.cwd, resolve(dirname(filename), specifier)).split(sep).join("/");
      const shared = target.match(/^shared\/([^/]+)(?:\/|$)/);
      if (shared && owner !== "shared/" + shared[1]) {
        context.report({ node, messageId: "shared", data: { specifier, alias: "@/shared/" + shared[1] } });
        return;
      }
      const runtime = target.match(runtimeSource);
      const path = runtime?.[1] ?? (builtInRoot.test(target) ? target : undefined);
      if (path) {
        context.report({ node, messageId: "alias", data: { specifier, alias: moduleAlias(path) } });
        return;
      }
      if (owner && target !== owner && !target.startsWith(owner + "/")) {
        context.report({ node, messageId: owner.startsWith("shared/") ? "outsideShared" : "outsideBlock", data: { specifier, directory: owner } });
      }
    });
  },
};

const sharedModuleEntry = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      entry: 'Only a shared module\'s entry is published. Import "{{alias}}" and re-export helpers from its index instead of importing "{{specifier}}".',
    },
  },
  create(context) {
    return importVisitors((node) => {
      const specifier = staticSpecifier(node);
      if (!specifier?.startsWith("@/shared/")) return;
      const path = specifier.slice("@/shared/".length);
      if (!path || path.includes("/") || path === "." || path === "..") {
        context.report({ node, messageId: "entry", data: { specifier, alias: "@/shared/" + (path.split("/")[0] || "<Name>") } });
      }
    });
  },
};

export default [{
  files: ["block-types/**/*.{ts,tsx,js,jsx}", "shared/**/*.{ts,tsx,js,jsx}"],
  languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true } } },
  linterOptions: { noInlineConfig: true },
  plugins: { turbofy: { rules: {
    "runtime-module-alias": runtimeModuleAlias,
    "shared-module-entry": sharedModuleEntry,
  } } },
  rules: {
    "turbofy/runtime-module-alias": "error",
    "turbofy/shared-module-entry": "error",
  },
}, {
  files: ["block-types/*/record.ts", "block-types/index.ts"],
  rules: {
    "turbofy/runtime-module-alias": "off",
    "turbofy/shared-module-entry": "off",
  },
}];
