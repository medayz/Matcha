const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    cb(null, `IMG-${Date.now()}` + path.extname(file.originalname));
  }
});

function checkFileType(file, cb) {
  console.log('ewa');
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname)
    return cb(null, true);
  else
    cb(new Error("Images Only!"));
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 4000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("profileImg");

const uploadMiddleware = (req, res, next) => {
	upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      err.status = 400;
      console.log('multer: ', err.message)
		  next(err);
    } else if (err) {
      err.status = 400;
      console.log('error: ', err.message)
		  next(err);
    }
    next();
	});
}

module.exports = uploadMiddleware;
