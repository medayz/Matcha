const path = require("path");

module.exports = {
    RSA_KEYS: path.join(path.dirname(__dirname), 'rsa_keys'),
    LIBRARIES: path.join(path.dirname(__dirname), 'libraries'),
    HELPERS: path.join(path.dirname(__dirname), 'helpers'),
    CONFIG: path.join(path.dirname(__dirname), 'config'),
    ROUTES: path.join(path.dirname(__dirname), 'routes'),
    CONTROLLERS: path.join(path.dirname(__dirname), 'controllers'),
    MODELS: path.join(path.dirname(__dirname), 'models'),
    MIDDLEWARES: path.join(path.dirname(__dirname), 'middlewares')
};