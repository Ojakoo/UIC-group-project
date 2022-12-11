import { Router } from "../deps.js";

const router = new Router();

const showMain = async ({ render }) => {
  render("main.eta");
};

router.get("/", showMain);

export { router };