import { Controller, Post, Inject } from '@midwayjs/core';
import { UploadService } from '../service/upload.service';
import * as multer from 'multer';
import * as path from 'path';

@Controller('/api/upload')
export class UploadController {
    @Inject()
    uploadService: UploadService;

    @Post('/image')
    async uploadImage(ctx: any) {
        try {
            console.log('Processing upload request');

            // 使用multer直接处理文件上传
            const upload = multer({
                storage: multer.diskStorage({
                    destination: (req, file, cb) => {
                        const uploadDir = path.join(__dirname, '../../public/uploads');
                        const fs = require('fs');
                        if (!fs.existsSync(uploadDir)) {
                            fs.mkdirSync(uploadDir, { recursive: true });
                        }
                        cb(null, uploadDir);
                    },
                    filename: (req, file, cb) => {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                        const ext = path.extname(file.originalname || 'jpg');
                        cb(null, `image-${uniqueSuffix}${ext}`);
                    }
                }),
                limits: {
                    fileSize: 5 * 1024 * 1024 // 5MB
                },
                fileFilter: (req, file, cb) => {
                    const allowedTypes = /jpeg|jpg|png|gif|webp/;
                    const extname = path.extname(file.originalname || '').toLowerCase();
                    if (allowedTypes.test(extname)) {
                        return cb(null, true);
                    } else {
                        cb(new Error('只支持图片文件 (jpeg, jpg, png, gif, webp)'));
                    }
                }
            });

            return new Promise((resolve, reject) => {
                upload.single('image')(ctx.req, ctx.res, async (err) => {
                    if (err) {
                        console.error('Multer error:', err);
                        resolve({
                            success: false,
                            message: err.message || '上传失败'
                        });
                        return;
                    }

                    const file = ctx.req.file;
                    if (!file) {
                        resolve({
                            success: false,
                            message: '没有上传文件'
                        });
                        return;
                    }

                    console.log('File uploaded:', file);

                    const imageUrl = `/uploads/${file.filename}`;
                    const fullImageUrl = `http://127.0.0.1:7001${imageUrl}`;
                    resolve({
                        success: true,
                        url: fullImageUrl,
                        filename: file.filename,
                        originalName: file.originalname,
                        size: file.size
                    });
                });
            });
        } catch (error) {
            console.error('Upload error:', error);
            return {
                success: false,
                message: error.message || '上传失败'
            };
        }
    }
} 