
import routes from './routes'

import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const ADMIN_EMAILS = process.env.ADMIN_EMAILS.split(',')

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })
  Router.beforeEach(async (to, from, next) => {
    const user = () => {
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
          unsubscribe();
          resolve(user);
        }, reject);
      })
    };
    const currentUser = await user()
    if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
      next()
    } else if (to.path === '/') {
      next()
    } else {
      next('/')
    }
  })
  return Router
})
