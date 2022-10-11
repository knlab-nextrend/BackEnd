const express = require("express");
const router = express.Router();
const fileCtrl = require("../controller/file.ctrl");
const authJWT = require("../middlewares/auth");
const multer = require('multer');
// Create multer object
const imageUpload = multer({
    dest: 'temp/images',
});
const pdfUpload = multer({
    dest:'temp/pdf',
})

router.get('/docImageDetach/',fileCtrl.docImageDetach);
router.post('/docImageAttach/',imageUpload.single('file'),fileCtrl.docImageAttach); //본문 이미지 업로드 및 url 리턴
router.post('/uploadExcelData/',pdfUpload.array('files'),authJWT,fileCtrl.uploadExcelData);

router.get('/getExcelData', fileCtrl.getExcelData)

module.exports = router;
