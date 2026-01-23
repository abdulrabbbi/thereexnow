export type ConfigValue = {
  appName: string;
  baseUrl: string;
  wssUrl: string;
  supportMail: string;
  graphqlUrl: string;
  assetsDir: string;
  isStaticExport: boolean;
  firebase: {
    appId: string;
    apiKey: string;
    projectId: string;
    authDomain: string;
    storageBucket: string;
    messagingSenderId: string;
  };
};
