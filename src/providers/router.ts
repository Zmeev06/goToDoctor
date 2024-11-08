import { routes } from "../pages/routes";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const user = localStorage.getItem("userData");
  const isRequireAuth = to.meta?.auth || false;
  const isRequireNoAuth = to.meta?.noAuth || false;

  if (isRequireAuth && !user) {
    next("/");
  } else if (isRequireNoAuth && user) {
    const userInfo = JSON.parse(user);
    next(userInfo.isDoctor ? "/mainpage2" : "/mainpage");
  } else {
    next();
  }
});

export { router };
