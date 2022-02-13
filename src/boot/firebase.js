import { boot } from 'quasar/wrappers'
import { initializeApp } from "firebase/app"

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({app, router, store}) => {
  const firebaseApp = initializeApp({
    apiKey: process.env.DB_API_KEY,
    authDomain: process.env.DB_AUTH_DOMAIN,
    projectId: process.env.DB_PROJECT_ID,
  });

  app.config.globalProperties.$firebase = firebaseApp;

})

