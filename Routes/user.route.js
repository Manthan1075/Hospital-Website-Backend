import express from 'express'
import { userLogin, userSignup, googleLogin, facebookLogin } from '../Controller/user.controller.js';

const router = express.Router();

router.route('/Register').post(userSignup);
router.route('/Login').post(userLogin);
router.route('/google-login').post(googleLogin);
router.route('/facebook-login').post(facebookLogin);

export default router;