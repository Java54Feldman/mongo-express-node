export function getError(code, text) {
    return { code, text };
}

export function notFoundError(text) {
    return getError(404, text);
}

export function badRequestError(text) {
    return getError(400, text);
}