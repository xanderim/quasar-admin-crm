import { boot } from 'quasar/wrappers'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, }) => {
  function secondsToHms(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);

    return `${h}h ${m}m`;
  }

  app.config.globalProperties.$filters = {
    convertSecondsToHms(value) {
      return secondsToHms(value)
    }
  }})
