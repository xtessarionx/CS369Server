import mongooseDef from "mongoose";
const mongoose = mongooseDef.default;

const TimeslotSchema = new mongoose.Schema({
    storeName:{type:String,required:true,unique:true},
    timeslot:{type:Array,required:true},
    maxSeat:{type:Number,required:true}
})

TimeslotSchema.methods.toData = function(){
    return{
        storeName:this.storeName,
        timeslot:this.timeslot,
        maxSeat:this.maxSeat
    }
}
const Timeslot = mongoose.model('timeslot',TimeslotSchema);

export default Timeslot;