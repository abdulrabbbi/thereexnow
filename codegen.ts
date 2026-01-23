import type { CodegenConfig } from "@graphql-codegen/cli";
import { graphqlUrl } from "./config";

const config: CodegenConfig = {
  overwrite: true,
  schema: graphqlUrl,
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
