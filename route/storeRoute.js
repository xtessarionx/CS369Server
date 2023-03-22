import { create,getAll,remove,getOne,edit,switchOnOff, login } from "../controller/storeController.js";
import express from 'express';
import { jwtPassport } from "../jwt-passport.js";

const router = express();

router.post('/login',login)
router.post('/create',create) //ลงทะเบียนร้านค้า
router.get('/',getAll) //เอาข้อมูลร้านค้าทั้งหมด
router.get('/:storeName',getOne) //เอาข้อมูลร้านค้าร้านเดียว
router.put('/:storeName',edit) //แก้ไขข้อมูลร้านค้า
router.get('/switchOnOff/:storeName',switchOnOff) //เปิดปิดร้านค้า
router.delete('/remove/:storeName',remove) //ลบร้านค้าออกจากระบบ



export default router