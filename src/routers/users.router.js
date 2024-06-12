import express from 'express';
import { UserController } from '../controllers/user.controller.js';

const router = express.Router();

const userController = new UserController();

// 내 정보 조회 API
router.get('/', userController.getUserInfo);

export default router;
