import bcrypt from 'bcrypt';
import Store from '../model/storeModel.js';

const protect = {
    _id:false,
    __v:false,
    username:false,
    password:false,
}

export const create = (req,res)=>{
    let {storeName,username,password,detail,phoneNum,type,isOpen} = req.body;
    console.log("create ",storeName,username,password,detail,phoneNum,type);
    if(!storeName||!username||!password||!phoneNum)
        return res.status(422).json({error:"Cannot create store without store name or username or password or phone number"});
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt ,(err,hash)=>{
            if(err) return res.status(400).json({error:"Bad request"});
            let flag = isOpen?isOpen:true;

            let newStore = new Store({
                storeName:storeName,
                username,
                password:hash,
                detail,
                phoneNum,
                type,
                isOpen:flag
                
            })
                 newStore.save()
                  .then(store=>{
                      return res.json({success:true,massage:`Created store: ${storeName}`,
                                        store:newStore.toData()})
                  })
                  .catch(err => res.status(400).json({error:err}))
             })
        })
}

export const getAll = (req,res)=>{
    Store.find({},protect)
    .then(stores=> res.json(stores))
    .catch(err=> res.status(500).json({error:err}))
}

export const remove = (req,res)=>{
    Store.findOneAndDelete({storeName:req.params.storeName})
     .then(store=>{
         if(!store) return res.status(404).json({error:"There are no store name: "+req.params.storeName})
         else return res.json({success:"Deleted store: "+req.params.storeName})
     }).catch(err=> res.status(404).json({error:err}))
}

export const getOne = (req,res)=>{
    Store.findOne({storeName:req.params.storeName},protect)
     .then(store=>{
        if(!store) return res.status(404).json({error:"There are no store name: "+req.params.storeName})
        else return res.json({success:true,store:store})
    }).catch(err=> res.status(404).json({error:err}))
}

export const edit = (req,res)=>{
    if(!req.body) return res.status(400).json({error:"Please send data to edit"})
    let {storeName,username,password,type,detail,phoneNum} = req.body;
    var newPassword = ""
    if(password){
        bcrypt.genSalt(10,(err,salt)=>{
            if(err) return res.status(500).json({error:"Internal server error"})
            bcrypt.hash(password,salt,(err,hash)=>{
                if(err) return res.status(500).json({error:"Internal server error"})
                newPassword = hash
                Store.findOne({storeName:req.params.storeName})
                .then(target => {
                    if(!target) return res.status(404).json({error:"There are no store name: "+req.params.storeName})
                    else {
                        if(!storeName) storeName = target.storeName 
                        if(!username) username = target.username
                        if(!type) type = target.type
                        if(!detail) detail = target.detail
                        if(!phoneNum) phoneNum = target.phoneNum
                        let tmp = {
                            storeName:storeName,
                            username:username,
                            password:newPassword,
                            type:type,
                            detail:detail,
                            phoneNum:phoneNum
                        }
                        Store.updateOne({storeName:req.params.storeName},tmp)
                        .then(update =>{
                            if(!update) res.status(400).json({error:"Cannot update store data: "+req.params.storeName})
                            else res.json({success:"Update store data"})
                        })
                        .catch(err=> res.status(400).json({error:"Cannot update store data: "+req.params.storeName,errorMsg:err}))
                    }
                })
                .catch(err=>{
                res.status(400).json({error:err,data:req.body})
                })
            })
        })
    }else{
        Store.findOne({storeName:req.params.storeName})
        .then(target => {
            if(!target) return res.status(404).json({error:"There are no store name: "+req.params.storeName})
            else {
                if(!storeName) storeName = target.storeName 
                if(!username) username = target.username
                if(!password) password = target.password
                if(!type) type = target.type
                if(!detail) detail = target.detail
                if(!phoneNum) phoneNum = target.phoneNum
                let tmp = {
                    storeName:storeName,
                    username:username,
                    password:password,
                    type:type,
                    detail:detail,
                    phoneNum:phoneNum
                }
                Store.updateOne({storeName:req.params.storeName},tmp)
                .then(update =>{
                    if(!update) res.status(400).json({error:"Cannot update store data: "+req.params.storeName})
                    else res.json({success:"Update store data"})
                })
                .catch(err=> res.status(400).json({error:"Cannot update store data: "+req.params.storeName,errorMsg:err}))
            }
        })
        .catch(err=>{
        res.status(400).json({error:err,data:req.body})
        })
    }
}

export const switchOnOff = (req,res)=>{
    let targetStore = req.params.storeName;
    Store.findOne({storeName:targetStore},{isOpen:true})
     .then(store=>{
         if(!store) return res.status(404).json({error:"There are no store name: "+req.params.storeName})
         else{
             let tmpFlag = store.isOpen.toString()=='true'?false:true
             Store.updateOne({storeName:targetStore},{isOpen:tmpFlag})
              .then(updated=>{
                  if(!updated) return res.status(500).json({error:"Internal server error"})
                  else{
                      res.json({success:true,message:`${targetStore} is ${store.isOpen?'closed':'opened'} now`})
                  }
              }).catch(err=> res.status(400).json({error:"Cannot turn on or off store",errorMsg:err}))
         }
     })
     .catch(err=>{
        res.status(400).json({error:err,data:req.body})
        })
}

export const login = (req,res)=>{
    let pw = req.body.password;
    let username = req.body.username;
    if(!pw||!username) return res.status(400).json({error:"Please send username and password!"});
    Store.findOne({username:username},{_id:false,__v:false})
     .then(store=>{
        if(!store) return res.status(404).json({error:"wrong username"})
        else{
            if(store.checkPassword(pw)){
                res.json({success:true,store:store.toAuthJSON()})
            }
            else return res.status(400).json({error:"Wrong password"})
            }
      })
      .catch(err=> res.status(500).json({error:"Internal error",err:err}))
}