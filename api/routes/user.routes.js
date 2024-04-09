import express from 'express';
import{test,updateUserProfile,deleteProfile,SignOut} from '../controlers/user.controler.js'
import { isAuthorized } from '../utils/Authorized.js';
const router=express.Router();
router.get('/test',test)
router.put('/updateProfile/:id',isAuthorized,updateUserProfile);
router.delete('/deleteProfile/:id',isAuthorized,deleteProfile);
router.get('/signOut/:id',isAuthorized,SignOut);

export default router;
