import mongooseDef from "mongoose";
import bcrypt from 'bcrypt';
import jsonwebtoken from "jsonwebtoken";
const mongoose = mongooseDef.default;
const jwtsecret = 'very-secret'

const StoreSchema = new mongoose.Schema({
    storeName:{type:String,required:true,unique:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlength:[40]},
    detail:{type:String},
    phoneNum:{type:String,required:true},
    type:{type:String,required:true},
    isOpen:{type:Boolean,default:true}
})

StoreSchema.methods.toData = function(){
    return{
        storeName:this.storeName,
        detail:this.detail,
        type:this.type,
        phoneNum:this.phoneNum,
        isOpen:this.isOpen
    }
}
StoreSchema.methods.checkPassword = function(pw){
    return bcrypt.compareSync(pw,this.password)
}

StoreSchema.methods.generateToken = function(){
    let expiresIn = 3600;
    return {token:jsonwebtoken.sign({storeName:this.storeName,
                                    detail:this.detail,
                                    type:this.type,
                                    phoneNum:this.phoneNum,
                                    isOpen:this.isOpen},jwtsecret,{expiresIn}),
            expiresIn:expiresIn}
}

StoreSchema.methods.toAuthJSON = function(){
    let genJWT = this.generateToken();
    return{
        storeName:this.storeName,
        detail:this.detail,
        type:this.type,
        phoneNum:this.phoneNum,
        isOpen:this.isOpen,
        token: 'bearer '+genJWT.token,
        expiresIn: genJWT.expiresIn
    }
}

let Store = mongoose.model('store',StoreSchema);

export default Store;