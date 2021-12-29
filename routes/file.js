const express = require("express");
const router = express.Router();
const fileService = require("../service/fileService");
const authJWT = require("../middlewares/auth");
const multer = require('multer');
// Create multer object
const imageUpload = multer({
    dest: 'temp/images',
});
const pdfUpload = multer({
    dest:'temp/pdf',
})

router.get('/docImageDetach/',fileService.docImageDetach);
router.post('/docImageAttach/',imageUpload.single('file'),fileService.docImageAttach); //본문 이미지 업로드 및 url 리턴
router.post('/uploadExcelData/',pdfUpload.array('files'),fileService.uploadExcelData);

module.exports = router;
