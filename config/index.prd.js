const baseUrl = "prd.api.therexnow.com";
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
    projectId: "aps-hep-now-prd",
    messagingSenderId: "1025369655874",
    authDomain: "aps-hep-now-prd.firebaseapp.com",
    storageBucket: "aps-hep-now-prd.appspot.com",
    apiKey: "AIzaSyBqJHceIGWHpC3tWTZ6QZ1GuzpAaw1ahcs",
    appId: "1:1025369655874:web:7b5ddeb6e4393471bd3bdb",
  },
};
