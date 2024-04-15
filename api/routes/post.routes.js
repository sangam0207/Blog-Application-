import express from 'express';
import {test,getPosts,createPost,deletePost,updatePosts,getPostById} from '../controlers/post.controler.js'
import {isAuthorized} from '../utils/Authorized.js'
const router=express.Router();
router.get('/getPosts',getPosts);
router.get('/:id',getPostById);
router.post('/create',isAuthorized,createPost);
router.delete('/deletePost/:id',deletePost);
router.put('/updatePost/:id',updatePosts);


export default router;
