// ======================================================================
//  src/controllers/users.controller.js
// ======================================================================

import {
  listUsers,
  createUser,
  getUser,
  updateUser,
  updateUserState,
  resetPassword,
} from "../services/users.service.js";

// ======================================================================
//  LIST USERS
// ======================================================================
export async function listUsersController(req, res) {
  const result = await listUsers(req);
  if (result.error)
    return res.status(result.status).json({ mensaje: result.error });
  return res.status(result.status).json(result.data);
}

// ======================================================================
//  CREATE USER
// ======================================================================
export async function createUserController(req, res) {
  const result = await createUser(req);
  if (result.error)
    return res.status(result.status).json({ mensaje: result.error });
  return res.status(result.status).json(result.data);
}

// ======================================================================
//  GET USER DETAIL
// ======================================================================
export async function getUserController(req, res) {
  const result = await getUser(req);
  if (result.error)
    return res.status(result.status).json({ mensaje: result.error });
  return res.status(result.status).json(result.data);
}

// ======================================================================
//  UPDATE USER
// ======================================================================
export async function updateUserController(req, res) {
  const result = await updateUser(req);
  if (result.error)
    return res.status(result.status).json({ mensaje: result.error });
  return res.status(result.status).json(result.data);
}

// ======================================================================
//  UPDATE USER STATE
// ======================================================================
export async function updateUserStateController(req, res) {
  const result = await updateUserState(req);
  if (result.error)
    return res.status(result.status).json({ mensaje: result.error });
  return res.status(result.status).json(result.data);
}

// ======================================================================
//  RESET PASSWORD
// ======================================================================
export async function resetPasswordController(req, res) {
  const result = await resetPassword(req);
  if (result.error)
    return res.status(result.status).json({ mensaje: result.error });
  return res.status(result.status).json(result.data);
}
