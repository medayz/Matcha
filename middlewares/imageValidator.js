const { loadImage } = require('canvas');

module.exports = (req, res, next) => {
    const uploadedImg = loadImage(req.file.path);
    uploadedImg
        .then(() => {
            next();
        }).catch(err => {
            err.status = 400;
            next(err);
        });
}