import express from 'express';
import { userLogin, userSignup, googleLogin, facebookLogin, getUserData, updateUser } from '../Controller/user.controller.js';
import { authMiddleware } from '../Middleware/auth.js';

const router = express.Router();

router.route('/Register').post(userSignup);
router.route('/Login').post(userLogin);
router.route('/google-login').post(googleLogin);
router.route('/facebook-login').post(facebookLogin);
router.route('/profile').get(authMiddleware, getUserData);
router.route('/profile').put(authMiddleware, updateUser)
router.route('/logout').post((req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  });

export default router;
