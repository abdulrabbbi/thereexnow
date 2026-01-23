const baseUrl = "dev.api.therexnow.com";
const supportMail = "Therexnow22@gmail.com";

module.exports = {
  supportMail,
  baseUrl: "https://" + baseUrl,
  wssUrl: "wss://" + baseUrl + "/graphql",
  graphqlUrl: "https://" + baseUrl + "/graphql",
  assetsDir: "https://therexnow-bucket.s3.us-west-1.amazonaws.com/",
  /**
   * Firebase
   */
  firebase: {
    projectId: "aps-hep-now-dev",
    messagingSenderId: "142139422371",
    authDomain: "aps-hep-now-dev.firebaseapp.com",
    storageBucket: "aps-hep-now-dev.firebasestorage.app",
    apiKey: "AIzaSyBm7kZSgGozAzbs6kw_8IWuWd_H5EVqxfY",
    appId: "1:142139422371:web:b6c265cf60670fbd313116",
  },
};
