import express from 'express'
import asyncHandler from 'express-async-handler';
import AccountsService from '../service/AccountsService.mjs';
export const accounts_route = express.Router();
const accountsService = new AccountsService(process.env.MONGO_URI, process.env.DB_NAME);
accounts_route.post("/account", asyncHandler(async (req, res) => {
    const result = await accountsService.insertAccount(req.body);
    res.status(201).json(result);
}))