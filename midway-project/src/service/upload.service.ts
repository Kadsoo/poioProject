import { Provide } from '@midwayjs/core';
import * as path from 'path';
import * as fs from 'fs';

@Provide()
export class UploadService {
    async handleUpload(file: any) {
        console.log('UploadService received file:', file);

        if (!file) {
            throw new Error('没有上传文件');
        }

        // 获取原始文件名并清理
        let originalName = file.originalname || file.filename || '';
        if (!originalName || originalName.includes('_cgi-bin_mmwebwx-bin_webwxgetmsgimg')) {
            // 如果是微信图片或其他特殊文件名，使用默认名称
            originalName = 'image.jpg';
        }

        // 检查文件类型
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = path.extname(originalName).toLowerCase();
        console.log('File extension:', extname);

        if (!allowedTypes.test(extname)) {
            throw new Error('只支持图片文件 (jpeg, jpg, png, gif)');
        }

        // 检查文件大小 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('文件大小不能超过5MB');
        }

        // 确保上传目录存在
        const uploadDir = path.join(__dirname, '../../public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // 生成唯一文件名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `image-${uniqueSuffix}${extname}`;
        const filepath = path.join(uploadDir, filename);

        console.log('Saving file to:', filepath);

        // 保存文件
        try {
            if (file.data) {
                // 如果是Buffer数据
                console.log('Saving as Buffer data');
                fs.writeFileSync(filepath, file.data);
            } else if (file.path) {
                // 如果是临时文件路径
                console.log('Saving from temp path:', file.path);
                fs.copyFileSync(file.path, filepath);
            } else {
                console.log('File object:', file);
                throw new Error('无法处理文件数据');
            }
        } catch (error) {
            console.error('File save error:', error);
            throw new Error('文件保存失败: ' + error.message);
        }

        const imageUrl = `/uploads/${filename}`;
        console.log('File saved successfully, URL:', imageUrl);

        return {
            success: true,
            url: imageUrl,
            filename: filename,
            originalName: originalName,
            size: file.size
        };
    }
} 