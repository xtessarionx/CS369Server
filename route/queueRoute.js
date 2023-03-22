import express from 'express';
import {allQueue,adding,queue,Qstore,remove,edit} from '../controller/queueController.js';

const router = express();

router.get('/',allQueue) //เรียกดูคิวทั้งหมดที่มีในระบบ
router.get('/findQ',queue) //เรียกดูคิวจากชื่อและเบอร์โทรลูกค้าใช้วิธีquery
router.get('/Qstore',Qstore) //เรียกดูคิวที่มีในร้านค้าดังกล่าว ด้วยการquery 
router.post('/add',adding) //เพิ่มคิวใหม่ (ไม่ต้องใส่วันที่เพราะฟิกวันที่ให้อยู่แล้ว)
router.delete('/deleteQ/:tel',remove) //ลบคิวที่จองด้วยชื่อและเบอร์โทรศัพท์
router.put('/editQ/:tel',edit) //แก้ไขข้อมูลการจองด้วยเบอร์โทรศัพท์

export default router