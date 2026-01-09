// const { send } = require("vite")
const userModel= require ("../models/userModel")
const bcrypt = require ("bcrypt")

const getUserController = async(req , res) => {
    try {
        const user = await userModel.findById({_id : req.user.id})
        // validation
        if(!user){
            return res.status(404).send({ 
                success : false , 
                message : "user not found" 
            })
        }
        user.password = undefined
        res.status(200).send({
            success:true,
            message:"user get succesfully",
            user,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: "error  in getting user",
            error
            
        })
    }
}

const updateUserController = async (req, res) => {
    try {
        const user = await userModel.findById({_id : req.user.id})
        if(!user){
           return  res.status(500).send({
                success:false,
                message: "user not found" ,
            })
        } 
        // update
        const {userName , address , phone} = req.body
        if(userName) user.userName = userName;
        if(address) user.address = address;
        if(phone) user.phone = phone;   
        await user.save()
        res.status(200).send({
             success : true ,
             message: "user updated successfully"
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
             success: false ,
              message : "error in updating user", 
              error
        })
    }
}

const updatePasswordController = async(req , res) => {
    try {
        const user = await userModel.findById({_id : req.user.id})
        // validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:"user not found",
            })
        }
        const {oldPassword , newPassword} = req.body;
        if(!oldPassword || !newPassword){
            return res.status(500).send({
                success: false,
                message:"not found"
            })
        }
        const isMatch = await bcrypt.compare(oldPassword ,user.password);
         if(!isMatch)
         {
            res.status(500).send({
            success:false,
            message:"invalid old password",
            });
          }
        var salt = bcrypt.genSaltSync(10)
         const hashedPassword = await bcrypt.hash(newPassword , salt)
         user.password = hashedPassword
         await user.save()
         res.status(200).send({
            success: true,
            message: "password updated"
         })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in password update",
            error
        })
    }
}

const resetPasswordController = async(req , res) => {
    try {
        const{email , newPassword , answer} = req.body
        if(!email || !newPassword || !answer){
            return res.status(500).send({
                success:false,
                message:"provide all fields"
            })
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(500).send({
                success: false,
                message : "user not found" ,
            })
        }
         var salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash( newPassword , salt)
        user.password = hashedPassword
        await user.save()
        res.status(200).send({
            success: true,
            message:  "user updated successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false , message : "error in reseting password" , error:"error in reseting password",
            error
        })
    }
}

const deleteProfileController = async (req , res) => {
        try {
            await userModel.findByIdAndDelete(req.user.id)
            return res.status(200).send({
                success: true,
                message:"deleted successfully"
            })
        } catch (error) {
             return res.status(500).send({
                success: false,
                message : "error in delete profile ",
                error
            })
        }
}



module.exports = {getUserController,updateUserController , resetPasswordController , updatePasswordController , deleteProfileController}; 