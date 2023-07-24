const mongoose=require("mongoose");
// const colors=require('')
const connectDatabase=async()=>{
    try {
        const connection=await mongoose.connect(process.env.URL,{useNewUrlParser:true,useUnifiedTopology:true});
        console.log(`Mongodb connected with server ${connection.connection.host}`);
    } catch (error) {
        console.log(error)
        
    }
    // mongoose.connect(process.env.URL,{useNewUrlParser:true,useUnifiedTopology:true}).then((data)=>{
        
}
module.exports=connectDatabase;