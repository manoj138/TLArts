//helper/successHandler.js

// send success response (200 ok)

const handle200 = (res, data = null, message="Success")=>{
    return res.status(200).json({
        success:true,
        message,
        data
    })
}

// send created response (201 created)

const handle201 = (res, data = null, message="Data created successfully")=>{
    return res.status(201).json({
        success:true,
        message,
        data
    })
}

// send delete response (204 no content)

const handle204 = (res,  message=" Data deleted successfully")=>{
    return res.status(204).json({
        success:true,
        message,
        
    })
}

module.exports={
    handle200,
    handle201,
    handle204
}