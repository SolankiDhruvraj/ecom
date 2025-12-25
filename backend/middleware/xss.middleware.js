import { inHTMLData } from 'xss-filters';

/**
 * Cleanup function to sanitize values
 * @param {any} data 
 * @returns {any}
 */
const clean = (data) => {
    if (!data) return data;

    if (typeof data === 'string') {
        return inHTMLData(data).trim();
    }

    if (Array.isArray(data)) {
        return data.map(item => clean(item));
    }

    if (typeof data === 'object') {
        const cleaned = {};
        for (const key in data) {
            cleaned[key] = clean(data[key]);
        }
        return cleaned;
    }

    return data;
};

/**
 * Middleware to sanitize request data
 * Note: In Express 5, req.query and req.params are read-only getters.
 * We only sanitize req.body which contains user-submitted data.
 */
export const xssSanitizer = (req, res, next) => {
    if (req.body) {
        req.body = clean(req.body);
    }
    next();
};
