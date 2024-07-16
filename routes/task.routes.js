import express from 'express';
import { createTask, deleteTask, getMyTask, getSingleTask, updateTask } from '../controllers/task.controllers.js';
import { isUserAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create',isUserAuthenticated ,createTask);
router.put('/update/:id',isUserAuthenticated, updateTask);
router.delete('/delete/:id',isUserAuthenticated, deleteTask);
router.get('/getMyTask',isUserAuthenticated, getMyTask);
router.get('getSingleTask/:id',isUserAuthenticated,getSingleTask);

export default router;