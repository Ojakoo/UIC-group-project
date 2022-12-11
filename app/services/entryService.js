import { executeQuery } from "../database/database";

const getAll = async () => {
  const data = await executeQuery(
    "SELECT * FROM entries;"
  )
}

const add = async ({ amount, location, growth }) => {
  await executeQuery(
    "INSERT INTO question_answers (amount, location, growth) VALUES ($amount, $location, $growth);",
    {
      amount: amount,
      location: location,
      growth: growth,
    },
  );
};

export { add, getAll };