import mongooseDef from "mongoose";
const mongoose = mongooseDef.default;

const QueueSchema = new mongoose.Schema({
    cus_name:{type:String,required:true},
    tel:{type:String,required:true,unique:true},
    cus_count:{type:Number,required:true},
    date:{type:Date},
    begin_time:{type:String,required:true},
    storeName:{type:String,required:true}
})

QueueSchema.methods.toData = function(){
    return{
        cus_name:this.cus_name,
        tel:this.tel,
        cus_count:this.cus_count,
        date:this.date,
        begin_time:this.begin_time,
        storeName:this.storeName
    } 
}

let Queue = mongoose.model('queue',QueueSchema);

export default Queue;