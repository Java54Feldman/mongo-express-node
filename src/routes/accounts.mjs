import express from 'express'
import asyncHandler from 'express-async-handler';
import AccountsService from '../service/AccountsService.mjs';

export const accounts_route = express.Router();
const accountsService = new AccountsService(process.env.MONGO_URI, process.env.DB_NAME);

accounts_route.post("/account", asyncHandler(async (req, res) => {
    const result = await accountsService.insertAccount(req.body);
    res.status(201).json(result);
}))

accounts_route.put("/update", asyncHandler(async (req, res) => {
    //update password
    //req.body {"username":<string>, "password":<string>}
    const result = await accountsService.updatePassword(req.body);
    res.status(200).json(result);
}))

accounts_route.get("/:username", asyncHandler(async (req, res) => {
    const account = await accountsService.getAccount(req.params.username);
    res.status(200).json(account);
}))

accounts_route.delete("/:username", asyncHandler(async (req, res) => {
    const deletedAccount = await accountsService.deleteAccount(req.params.username);
    res.status(200).json(deletedAccount);
}))
