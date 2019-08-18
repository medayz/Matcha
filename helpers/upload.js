const path = require("path");
// const multer = require("multer");

// const storage = multer.diskStorage({
// 	destination: "./public/uploads/",
// 	filename: function(req, file, cb){
// 	   cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
// 	}
// });

// function checkFileType(file, cb) {
// 	const filetypes = /jpeg|jpg|png/;
// 	const extname = filetypes.test(path.extname(file.originalname).
// 	toLowerCase());
// 	const mimetype = filetypes.test(file.mimetype);
// 	if (mimetype && extname)
// 		return cb(null, true);
// 	else
// 		cb('Error: Images Only!');
// }

// const upload = multer({
// 	storage: storage,
// 	limits:{fileSize: 4000000},
// 	fileFilter: function(req, file, cb){
// 		checkFileType(file, cb);
// 	}
// }).single("profileImg")

// module.exports = upload;
