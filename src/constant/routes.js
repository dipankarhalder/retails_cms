export const routes = {
  // health check
  health_check: "/v1/health-check",

  // authentication
  register: "/v1/register",
  login: "/v1/login",

  // user profile
  profile: "/v1/:role/:profileId",
  update_profile: "/v1/:profileId",
  update_password: "/v1/:profileId",
};
