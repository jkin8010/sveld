import * as test from "tape";
import { writeTsDefinition, formatTsProps, getTypeDefs } from "../src/writer/writer-ts-definitions";
import { ComponentDocApi } from "../src/rollup-plugin";
import { ParsedComponent } from "../src/ComponentParser";

test("writeTsDefinition", (t) => {
  t.equal(formatTsProps(undefined), "any");
  t.equal(formatTsProps("{ a: null }"), "{ a: null }\n");

  t.equal(getTypeDefs({ typedefs: [] }), "");
  t.equal(
    getTypeDefs({
      typedefs: [
        {
          type: "{ [key: string]: boolean; }",
          name: "MyTypedef",
          ts: "interface MyTypedef { [key: string]: boolean; }",
        },
      ],
    }),
    "export interface MyTypedef { [key: string]: boolean; }"
  );

  const parsed_output: ParsedComponent = {
    props: [
      {
        name: "propBool",
        kind: "let",
        type: "boolean",
        value: "true",
        isFunction: false,
        constant: false,
        reactive: true,
      },
      {
        name: "propString",
        kind: "let",
        type: "string",
        value: '""',
        isFunction: false,
        constant: false,
        reactive: false,
      },
      {
        name: "name",
        kind: "let",
        type: "string",
        isFunction: false,
        constant: false,
        reactive: false,
      },
      {
        name: "id",
        kind: "let",
        type: "string",
        value: '"" + Math.random().toString(36)',
        isFunction: false,
        constant: false,
        reactive: false,
      },
      {
        name: "propConst",
        kind: "const",
        type: "{ [key: string]: boolean; }",
        value: '{ ["1"]: true }',
        isFunction: false,
        constant: true,
        reactive: false,
      },
      {
        name: "fn",
        kind: "function",
        type: "() => {     localBool = !localBool;   }",
        value: "() => {     localBool = !localBool;   }",
        isFunction: true,
        constant: false,
        reactive: false,
      },
    ],
    slots: [
      {
        name: "__default__",
        default: true,
        fallback: "{name}",
        slot_props: "{}",
      },
    ],
    events: [],
    typedefs: [],
    rest_props: undefined,
  };

  const component_api: ComponentDocApi = {
    moduleName: "ModuleName",
    filePath: "./src/ModuleName.svelte",
    ...parsed_output,
  };

  t.equal(
    writeTsDefinition(component_api),
    '\n  /// <reference types="svelte" />\n  import { SvelteComponentTyped } from "svelte";\n  \n  \n  \n    export interface ModuleNameProps  {\n      \n      /**\n* @default true\n*/\n      propBool?: boolean;\n\n      /**\n* @default ""\n*/\n      propString?: string;\n\n      \n      name?: string;\n\n      /**\n* @default "" + Math.random().toString(36)\n*/\n      id?: string;\n\n      /**\n* @constant\n* @default { ["1"]: true }\n*/\n      propConst?: { ["1"]: true };\n\n      /**\n* @default () => { localBool = !localBool; }\n*/\n      fn?: () => {     localBool = !localBool;   };\n    }\n  \n\n  export default class ModuleName extends SvelteComponentTyped<\n      ModuleNameProps,\n      {},\n      {default: {}\n;}\n    > {}'
  );
  t.end();
});
