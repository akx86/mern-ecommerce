
const sanitize = (obj) => {
    for (let key in obj) {
        if (key.startsWith('$')) {
            delete obj[key];
        } 
        else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitize(obj[key]);
        }
    }
};

const mongoSanitize = (req, res, next) => {
    if (req.body) sanitize(req.body);
    
    if (req.query) sanitize(req.query);
    
    if (req.params) sanitize(req.params);

    next();
};

module.exports = mongoSanitize;