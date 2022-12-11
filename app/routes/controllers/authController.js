import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";
import {
  isEmail,
  isString,
  minLength,
  required,
  validate,
} from "../../deps.js";

const authValidationRules = {
  email: [required, isEmail],
  password: [required, isString, minLength(4)],
};

const showRegistrationForm = ({ render }) => {
  render("register.eta");
};

const postRegistrationForm = async ({ request, response, state }) => {
  const params = await request.body().value;

  const email = params.get("email");
  const password = params.get("password");

  const data = { email: email, password: password };
  const [passes, errors] = await validate(data, authValidationRules);

  if (!passes) {
    await state.session.flash("formData", { email: email });
    await state.session.flash("errors", errors);
    response.redirect("/auth/register");
  } else {
    const existingUsers = await userService.findUsersWithEmail(email);

    if (existingUsers.rows.length > 0) {
      await state.session.flash("formData", { email: email });
      await state.session.flash("errors", {
        email: { used: "User with this email already exists." },
      });
      response.redirect("/auth/register");
    } else {
      const hash = await bcrypt.hash(password);
      await userService.addUser(email, hash);

      response.redirect("/auth/login");
    }
  }
};

const showLoginForm = ({ render }) => {
  render("login.eta");
};

const postLoginForm = async ({ request, response, state }) => {
  const params = await request.body().value;

  const email = params.get("email");
  const password = params.get("password");

  const data = { email: email, password: password };
  const [passes, errors] = await validate(data, authValidationRules);

  if (!passes) {
    await state.session.flash("formData", { email: email });
    await state.session.flash("errors", errors);
    response.redirect("/auth/login");
  } else {
    const existingUsers = await userService.findUsersWithEmail(email);

    const loginError = {
      login: { incorrect: "Email or passwor incorrect, try again." },
    };

    if (existingUsers.rows.length === 0) {
      await state.session.flash("formData", { email: email });
      await state.session.flash("errors", loginError);
      response.redirect("/auth/login");
    } else {
      const userObj = existingUsers.rows[0];

      const hash = userObj.password;
      const passwordCorrect = await bcrypt.compare(password, hash);

      if (!passwordCorrect) {
        await state.session.flash("formData", { email: email });
        await state.session.flash("errors", loginError);
        response.redirect("/auth/login");
      } else {
        await state.session.set("authenticated", true);
        await state.session.set("user", {
          id: userObj.id,
          email: userObj.email,
        });

        response.redirect("/");
      }
    }
  }
};

const postLogoutForm = async ({ response, state }) => {
  await state.session.deleteSession();
  response.redirect("/");
};

export {
  postLoginForm,
  postLogoutForm,
  postRegistrationForm,
  showLoginForm,
  showRegistrationForm,
};
