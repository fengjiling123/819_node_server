import Information from '../contraller/dataManger/information';
import express from 'express';
let router = express.Router();

router.post('/create', Information.createInfromation);
router.get('/', Information.getInformation);
router.post('/delAll', Information.delAll);

export default router;

