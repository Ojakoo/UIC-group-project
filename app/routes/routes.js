import { Router } from "../deps.js";
import * as authController from "./controllers/authController.js"

const router = new Router();

const showMain = async ({ render }) => {
  render("main.eta");
};

router.get("/", showMain);

router.get("/auth/register", authController.showRegistrationForm);
router.post("/auth/register", authController.postRegistrationForm);
router.get("/auth/login", authController.showLoginForm);
router.post("/auth/login", authController.postLoginForm);
router.post("/auth/logout", authController.postLogoutForm);

export { router };