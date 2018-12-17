import express from 'express';
var router = express.Router();

import Admin from '../contraller/admin/index';

/* GET users listing. */
router.get('/list', Admin.adminList);

router.post('/user/create',Admin.userCreate);

export default router;
