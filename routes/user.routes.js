import express from 'express';
import { myProfile, userLogin,userLogout,userRegister } from '../controllers/user.contollers.js';
import { isUserAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post('/login',userLogin);
router.post('/register',userRegister);
router.get('/logout',isUserAuthenticated,userLogout);
router.get('/getUserProfile',isUserAuthenticated,myProfile);

// router.get('/getusers',getAllUser);
// router.put('/updateUser/:id',updateUser);
// router.delete('/deleteUser/:id',deleteUser);
// router.get('/userProfile/:id,userProfile)


export default router;