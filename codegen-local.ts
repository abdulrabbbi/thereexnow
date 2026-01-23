import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: './schema.graphql',
  documents: ["./src/graphql/**/*.gql"],
  generates: {
    "./src/graphql/generated.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
      config: {
        addInfiniteQuery: false,
        reactQueryVersion: 5,
        fetcher: {
          func: "./fetcher#fetcher",
        },
      },
    },
  },
};

export default config;
