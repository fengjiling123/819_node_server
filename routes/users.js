import express from 'express';
var router = express.Router();

import Admin from '../contraller/admin/index';

/* GET users listing. */
router.get('/list', Admin.adminList);

router.post('/user/create', Admin.userCreate);

router.get('/auths', Admin.moduleList);

router.post('/roles/create', Admin.roleCreate);

router.get('/roleList', Admin.getRolesList);

router.get('/users', Admin.getUsersList);

export default router;
