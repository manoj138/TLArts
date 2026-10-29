
const fs = require("fs");
const path = require("path");

// Delete file safely
function safeUnlink(filePath){
    try{
                // Check if file exists
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
            console.log("Deleted", filePath);
            
        }
    }catch(e){
        console.warn("failed to delete", filePath);
    
    }
}

// Find uploaded files and delete them
function deleteUploadedFiles(data){
      // Stop if no data
    if(!data) return;

    // Check if data is an object
    if(typeof data === "object"){
        for(const key in data){
             // Check string values
            if (typeof data[key] === "string"){
                     // Check upload file path
                if(data[key].startsWith("uploads/")){
                    // Create full file path
                    const filePath=path.join(
                        process.cwd(),
                        "public",
                        data[key]
                    )
                    // Delete file
                    safeUnlink(filePath)
                }
                // Check nested objects
            }else if(typeof data[key] === "object"){
                // Search inside nested object
  deleteUploadedFiles(data[key]);
            }
        }
    }
}

module.exports = {deleteUploadedFiles}