import { apiHealthCheck } from "../controllers/healthCheck.controller.js";
import { routes } from "../constant/routes.js";

export default (router) => {
  router.get(routes.health_check, apiHealthCheck.getHealthCheck);
};
