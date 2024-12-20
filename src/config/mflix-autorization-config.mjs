import { getError } from "../errors/error.mjs";
import config from "config";
const LIMIT_REQUESTS_PER_TIME_WINDOW = 2;
const roles = {
    USER: userAuthorizationFunction,
    PREMIUM_USER: async (accountsService, username) => true,
    ADMIN: async (accountsService, username) => {
        throw getError(403, "");
    },
};
async function userAuthorizationFunction(accountsService, username) {
    //one user cannot send several requests simultaneously
    const TIME_WINDOW_MILLIS = config.get("time_window_millisec");
    const currentTime = new Date().getTime();
    let { timestamp, counter } = await accountsService.getTimestampCounter(username);
    if (timestamp && currentTime - timestamp < TIME_WINDOW_MILLIS) {
        if (counter >= LIMIT_REQUESTS_PER_TIME_WINDOW) {
            throw getError(403, "exceeded limit for role USER, upgrade account");
        } else {
            counter++;
        }
    } else {
        timestamp = currentTime;
        counter = 1;
    }
    return await accountsService.setTimestampCounter(username, timestamp, counter);
}
export default roles;
