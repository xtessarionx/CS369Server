import Timeslot from "../model/timeslotModel.js";

const protect = {
    _id:false,
    __v:false,
    maxSeat:false
}

export const create = (req,res)=>{
    let {storeName,timeslot,maxSeat} = req.body;
    if(!storeName||!timeslot||!maxSeat) return res.status(422).json({error:"your data are not fulfill"});
    let newTimeslot = new Timeslot({storeName:storeName,timeslot:timeslot,maxSeat:maxSeat});
    newTimeslot.save()
    .then(slot=>{
        return res.json({success:true,massage:`Created slot for : ${storeName}`,
                          slot:newTimeslot.toData()})
    })
    .catch(err => res.status(400).json({error:err}))
}

export const getSlot = (req,res)=>{
    let targetStore = req.params.storeName;
    Timeslot.findOne({storeName:targetStore},protect)
     .then(result=>{
         if(!result) return res.status(404).json({error:"Cannot find slot for store: "+targetStore})
         else{
             res.json({success:true,data:result})
         }
     })
     .catch(err=> res.status(400).json({error:err}))
}

export const decreaseSeat = (req,res)=>{
    if(!req.query.begin_time) return res.status(400).json({error:"Require begin time to select slot!"})
    if(!req.query.seat) return res.status(400).json({error:"Require seat count to book seat!"})
    
	console.log(req.query.begin_time,req.query.seat)
    Timeslot.findOne({storeName:req.params.storeName})
     .then(store=>{
        if(!store) res.status(404).json({error:"Cannot found time slot of "+req.params.storeName})
        else{
            let slot = store.timeslot;
            let index = slot.findIndex(ele=> ele.begin_time===req.query.begin_time)
            let tmp = slot[index]
            let seat = 0;
            try {
                seat = parseInt(req.query.seat,10)
                if(isNaN(seat))
                 throw new Error("This is not a number");
            } catch (error) {
                return res.status(400).json({error:"Number of seat should be a integer."})
            }
            if(tmp.remain_seat<seat) return res.status(400).json({error:"Remain seat are not enough for wanted seat"})
            tmp.remain_seat -= seat
            slot[index] = tmp
            Timeslot.updateOne({storeName:req.params.storeName},{timeslot:slot},{new:true,runValidators: true})
             .then(result =>{
                 if(!result) return res.status(500).json({error:"Internal error"})
                 else{
                     if(result.acknowledged.toString()==='true')
                        res.json({success:true,message:"Editted timeslot's seat"})
                     else res.status(500).json({error:"Internal error cannot edit remain seat"})
                 }
             })
        }
     }).catch(err=> {
         res.status(500).json({error:"Something is error on internal server"})
     })
}

export const resetSeat = (req,res)=>{
    let targetStore = req.params.storeName;
    Timeslot.findOne({storeName:targetStore})
     .then(store=>{
        if(!store) res.status(404).json({error:"Cannot found time slot of "+req.params.storeName})
        else{
            let maxSeat = store.maxSeat;
            let tmp = store.timeslot;
            tmp.forEach(element => {
                element.remain_seat = maxSeat;
            });
            Timeslot.updateOne({storeName:targetStore},{timeslot:tmp},{new:true,runValidators:true})
             .then(result=>{
                 if(!result) return res.status(500).json({error:"Something is error on internal server"})
                 else{
                    if(result.acknowledged.toString()==='true')
                           res.json({success:true,message:"Reset seat complete"})
                        else res.status(500).json({error:"Internal error cannot edit reset seat"})
                 }
             })
        }
     })
     .catch(err=> {console.log(err);res.status(500).json({error:"Something is error on internal server"})})
}