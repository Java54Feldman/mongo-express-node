import { getError } from "../errors/error.mjs";
import MongoConnection from "../mongo/MongoConnection.mjs";
import bcrypt from "bcrypt";
export default class AccountsService {
    #accounts;
    #connection;
    constructor(connectionStr, dbName) {
        this.#connection = new MongoConnection(connectionStr, dbName);
        this.#accounts = this.#connection.getCollection("accounts");
    }
    async insertAccount(account) {
        const accountDB = await this.#accounts.findOne({ _id: account.username });
        if (accountDB) {
            throw getError(400, `account for ${account.username} already exists`);
        }
        const toInsertAccount = this.#toAccountDB(account);
        const result = await this.#accounts.insertOne(toInsertAccount);
        if (result.insertedId == account.username) {
            return toInsertAccount;
        }
    }

    #toAccountDB(account) {
        const accountDB = {};
        accountDB._id = account.username;
        accountDB.email = account.email;
        accountDB.hashPassword = bcrypt.hashSync(account.password, 10);
        return accountDB;
    }

    async updatePassword({ username, password }) {
        const newPassword = bcrypt.hashSync(password, 10);
        const accountUpdated = await this.#accounts.findOneAndUpdate(
            { _id: username },
            { $set: { hashPassword: newPassword } },
            { returnDocument: "after" }
        );
        if (!accountUpdated) {
            throw getError(404, `account for ${username} not found`);
        }
        return accountUpdated;
    }

    async getAccount(username) {
        const account = await this.#accounts.findOne({ _id: username });
        if (!account) {
            throw getError(404, `Account ${username} not found`);
        }
        return account;
    }

    async deleteAccount(username) {
        const toDeleteAccount = await this.getAccount(username);
        await this.#accounts.deleteOne({ _id: username });
        return toDeleteAccount;
    }
}
