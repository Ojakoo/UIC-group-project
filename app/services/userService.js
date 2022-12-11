import { executeQuery } from "../database/database.js";

const findUsersWithEmail = async (email) => {
  return await executeQuery(
    "SELECT * FROM users WHERE email = $email;",
    { email: email },
  );
};

const addUser = async (email, passwordHash) => {
  await executeQuery(
    "INSERT INTO users (email, password) VALUES ($email, $passwordHash);",
    { email: email, passwordHash: passwordHash },
  );
};

export { addUser, findUsersWithEmail };