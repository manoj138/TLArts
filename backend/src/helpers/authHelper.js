const bcrypt= require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
 * Convert a plain password into a hashed password
 */

const hashPassword = async(password) =>{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt)
};

/*
 * Check if the entered password matches the hashed password
 */

const comparePassword = async(password, hashedPassword)=>{
    return await bcrypt.compare(password, hashedPassword)
}

/*
 * Create a JWT token with user data
 */

const generateToken = (payload)=>{
    const expiresIn = process.env.JWT_EXPIRE || "7d";

    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn}
    );
}

/*
 * Verify the JWT token
 * Returns decoded data if valid, otherwise returns null
 */

const verifyToken = (token)=>{
    try{
        return jwt.verify(
            token,
            process.env.JWT_SECRET
        );
    }catch(error){
        return null
    }
};

module.exports={
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
}