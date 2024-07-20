import { Router } from 'express';
import {uploadImage,resizeImage,cropImage,downloadImage,applyGrayscale,applyBlur,addWatermark} from '../controllers/imageController';
import upload from '../middleware/upload';

const router = Router();

router.post('/upload', upload.single('image'), uploadImage);
router.post('/resize', resizeImage);
router.post('/crop', cropImage);
router.post('/grayscale', applyGrayscale);
router.post('/blur', applyBlur);
router.post('/watermark', addWatermark);
router.get('/download/:filename', downloadImage);


export default router;
