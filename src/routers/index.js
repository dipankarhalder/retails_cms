import express from "express";

import healthCheck from "./healthCheck.route.js";
import authentication from "./auth.route.js";

/* router with default export */
const router = express.Router();

export default () => {
  healthCheck(router);
  authentication(router);

  return router;
};
