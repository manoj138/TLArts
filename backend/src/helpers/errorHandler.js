//helpers/errorHandler.js

/*** fromats Mongoose Error into a flat object  */

const formatMongooseError = (res, error) =>{
    let errors = {};

    //validation Error
    if(error.name = "validationError"){
        Object.keys(error.errors).forEach((key)=>{
            errors[key]=error.errors[key].message;
        });

        return res.status(422).json({
            status:false,
            errors,
        });
    }

    //Duplicate key Error
    if(error.code ===11000){
        Object.keys(error.keyValue).forEach((key)=>{
            errors[key]=`${key} already exists`;
        
        });

        return res.status(422).json({
            status:false,
            errors
        });
    }
     
    return handle500(res, error);
};


/*** Handles 404 Not Found Errors */

const handle404 = (res, message = "resource not found")=>{
    return res.status(404).json({
        status:false,
        errors:{
            route:message
        },
    });
};

/*** Handles 404 Not Found Errors */

const handle401 = (res, message = "Session Expired, please login agian..!")=>{
    return res.status(401).json({
        status:false,
        errors:{
            auth:message,
        },
    });
};


/*** Handles 422 Server Errors*/

const handle422=(res, errors={})=>{
    return res.status(422).json({
        status:false,
        errors,
    });
};


/*** Handles 500 Server Errors */

const handle500 = (res, error)=>{
    console.log("Internal Server Error:" , error);
    

    return res.status(500).json({
        status:false,
        errors:{
            server:error?.message || "Internal Server Error"
        },
    });
};

module.exports={
    formatMongooseError,
    handle401,
    handle404,
    handle422,
    handle500
}

