import * as entryService from "../../services/entryService.js";
import {
  isInt,
  isString,
  required,
  validate,
} from "../../deps.js";

const entryValidationRules = {
  amount: [required, isInt],
  growth: [required, isInt],
  location: [required, isString]
};

const showEntries = async ({ render }) => {
  const entries = await entryService.getAll();
  render("entries.eta", { entries: entries });
};

const postEntryForm = async ({ user, request, response, state }) => {
  console.log("post entry at controller");
  const values = await request.body().value;

  const amount = Number(values.get("amount")); 
  const location = values.get("location"); 
  const growth = Number(values.get("growth"));

  const data = { 
    amount: amount,
    location: location,
    growth: growth,
  };

  const [passes, errors] = await validate(
    data,
    entryValidationRules
  );

  if (!passes || !user) {
    await state.session.flash("formData", data);
    await state.session.flash("errors", errors);
    response.redirect("/entries");
  } else {
    await entryService.add(data);
    response.redirect("/entries");
  }
};

export {
  showEntries,
  postEntryForm,
};
