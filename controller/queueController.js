import Queue from'../model/queueModel.js';
import Store from '../model/storeModel.js';
const protect = {
    _id:false,
    __v:false,
    username:false,
    password:false,
}

export const allQueue = (req, res) => {
    Queue.find({},protect).then(result =>  res.json(result));
    console.log("รายการคิวทั้งหมดที่มีในระบบ LetsQueue")
}

export const queue =(req,res)=>{
    Queue.findOne({cus_name:req.query.cus_name,tel:req.query.tel},protect).then((result)=>{
        console.log("รายการคิวที่ค้นหา")
        return res.send(result);
    }).catch(err=>{
        console.log(err);
        return res.status(500).send({
            errors:{Message:"ค้นหาคิวดังกล่าวไม่พบ กรุณาลองใหม่อีกครั้ง"}
        })
    })
}

export const Qstore =(req,res)=>{
    Queue.find({storeName:req.query.storeName},protect).then((result)=>{
        console.log("รายการคิวในร้านค้าที่ค้นหา")
        return res.json({success:true,QueueInThisStore:result});
    }).catch(err=>{
        console.log(err);
        return res.status(500).send({
            errors:{Message:"ค้นหาร้านค้าดังกล่าวในระบบไม่พบ กรุณาลองใหม่อีกครั้ง"}
        })
    })
}

export const adding=(req,res)=>{
    let{cus_name,tel,cus_count,begin_time,storeName}=req.body;
    if(!cus_name||!tel||!cus_count||!begin_time||!storeName) return res.status(422).json({error:"กรุณากรอกข้อมูลให้ครบ"});
    var currentDate=new Date();
    let newQueue=new Queue({cus_name:cus_name,tel:tel,cus_count:cus_count,date:currentDate,begin_time:begin_time,storeName:storeName})
    newQueue.save().then((result)=>{
        console.log("เพิ่มรายการจองคิวสำเร็จ")
        return res.json({success:true,Message:`เพิ่มรายการคิวสำหรับคุณ : ${cus_name}`,result:newQueue.toData()});
        
    }).catch(err=>{
        console.log(err);
        return res.status(500).send({
            errors:{Message:"ทำรายการจองคิวไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"}
        })
    })

}

export const remove = (req, res) => {
      Queue.findOneAndDelete({tel:req.params.tel}).then((result)=>{ 
            if(!result)
                res.status(500).json({error:"There are something error on interval server"});
            console.log("ลบรายการจองคิวสำเร็จ")
            res.json({success:"ลบรายการจองคิวของหมายเลขโทรศัพท์"+req.params.tel+"สำเร็จ"});
        }).catch(err => {
             res.status(404).json({errors:"ลบรายการจองคิวไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"})
    })
}

export const edit = (req, res) => {
    let{cus_name,tel,cus_count,begin_time,storeName}=req.body;
    console.log("หมายเลขโทรศัพท์ที่ทำการจองคือหมายเลข "+req.params.tel)
      Queue.findOne({tel:req.params.tel}).then((result)=>{
        if(!result) return res.status(404).json({error:"ไม่มีหมายเลขโทรศัพท์"+req.params.tel+"ในระบบ"})
        else {
            if(!cus_name)  cus_name=result.cus_name 
            if(!tel) tel = result.tel
            if(!cus_count) cus_count=result.cus_count
            if(!begin_time) begin_time=result.begin_time
            if(!storeName)storeName=result.storeName
                let tmp = {
                    cus_name:cus_name,
                    tel:tel,
                    cus_count:cus_count,
                    begin_time:begin_time,
                    storeName:storeName,
                }
            Queue.updateOne({tel:req.params.tel},tmp)
            .then(update =>{
                if(!update) res.status(400).json({error:"ไม่สามารถแก้ไขการจองคิวเบอร์"+req.params.tel+"นี้ได้ "})
                else res.json({success:"แก้ไขข้อมูลการจองสำเร็จ"})
            })
            .catch(err=> res.status(400).json({error:"แก้ไขรายการจองคิวไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"}))
        }
    
    }).catch(err => {
        return res.status(404).send({
            errors: {Message: "แก้ไขรายการจองคิวไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"}
        })
     })
}
       

