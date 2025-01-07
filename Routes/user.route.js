import express from 'express';
import { userLogin, userSignup, googleLogin, facebookLogin, getUserData } from '../Controller/user.controller.js';
import { authMiddleware } from '../Middleware/auth.js';

const router = express.Router();

router.route('/Register').post(userSignup);
router.route('/Login').post(userLogin);
router.route('/google-login').post(googleLogin);
router.route('/facebook-login').post(facebookLogin);
router.route('/profile').post(authMiddleware, getUserData); 

export default router;
