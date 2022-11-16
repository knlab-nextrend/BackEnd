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
<<<<<<< HEAD
    dest:'temp/pdf',
})

router.get('/docImageDetach/',fileCtrl.docImageDetach);
router.post('/docImageAttach/',imageUpload.single('file'),fileCtrl.docImageAttach); //본문 이미지 업로드 및 url 리턴
router.post('/uploadExcelData/',pdfUpload.array('files'),authJWT,fileCtrl.uploadExcelData);

=======
    dest:'temp/files',
})

router.get('/docImageDetach/',fileCtrl.docImageDetach);
router.post('/docImageAttach/',imageUpload.single('files'), fileCtrl.docImageAttach); //본문 이미지 업로드 및 url 리턴
router.post('/uploadExcelData/',pdfUpload.fields([{name : 'pdfs'},{name :'thumbnails'}]),authJWT, fileCtrl.uploadExcelData);

router.get('/excel/list', fileCtrl.getExcelData)
router.get('/excel/detail', fileCtrl.getExcelDetail)
router.get('/excel/migrate', fileCtrl.migration);
>>>>>>> 4eb73263aa397f263d894e5d2b35198f54b3df69
module.exports = router;
