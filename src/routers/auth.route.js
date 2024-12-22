import {
  adminRegistration,
  adminLogin,
} from "../controllers/auth.controller.js";
import { routes } from "../constant/routes.js";

export default (router) => {
  router.post(routes.register, adminRegistration);
  router.post(routes.login, adminLogin);
};
