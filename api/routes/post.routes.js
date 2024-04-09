import express from 'express';
import {test,createPost,getPosts,deletePost,updatePosts} from '../controlers/post.controler.js'
import {isAuthorized} from '../utils/Authorized.js'
const router=express.Router();
router.get('/test',test)
router.post('/create',isAuthorized,createPost);
router.get('/getPosts',getPosts);
router.delete('/deletePost/:id',deletePost);
router.put('updatePosts/:id',updatePosts);


export default router;
