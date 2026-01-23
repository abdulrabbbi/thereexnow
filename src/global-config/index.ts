import configs from "../../config";
import { ConfigValue } from "./types";

export const GLOBAL_CONFIG: ConfigValue = {
  appName: "Therexnow",
  wssUrl: configs.wssUrl,
  baseUrl: configs.baseUrl,
  graphqlUrl: configs.graphqlUrl,
  supportMail: configs.supportMail,
  assetsDir: "https://therexnow-bucket.s3.us-west-1.amazonaws.com/",
  isStaticExport: JSON.parse(`${process.env.BUILD_STATIC_EXPORT}`),
  /**
   * Firebase
   */
  firebase: configs.firebase,
};
