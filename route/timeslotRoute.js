import express from 'express';
import { create, getSlot,decreaseSeat,resetSeat } from '../controller/timeslotController.js';

const router = express();

router.post('/create',create)
router.get('/:storeName',getSlot)
router.put('/decSeat/:storeName',decreaseSeat) //ex localhost:4000/api/timeslot/decSeat/Nomwan?begin_time=16:00&seat=7
router.put('/reset/:storeName',resetSeat)


export default router