import { check } from "express-validator";

export const validateUser = [
  check("userName")
    .isString()
    .withMessage("userName doit être une chaîne de caractères")
    .isLength({ min: 2, max: 20 })
    .withMessage("userName doit contenir entre 2 et 20 caractères")
    .not()
    .isEmpty()
    .withMessage("userName ne peut pas être vide"),
  check("displayName")
    .isString()
    .withMessage("displayName doit être une chaîne de caractères")
    .not()
    .isEmpty()
    .withMessage("displayName ne peut pas être vide"),
];
