import { userAuthentication } from "../controllers/auth.controller.js";
import { routes } from "../constant/routes.js";

export default (router) => {
  router.post(routes.register, userAuthentication.userRegistration);
  router.post(routes.login, userAuthentication.userLogin);
  router.get(routes.profile, userAuthentication.userProfile);
  router.patch(routes.update_profile, userAuthentication.updateProfile);
  router.put(routes.update_password, userAuthentication.updatePassword);
};
