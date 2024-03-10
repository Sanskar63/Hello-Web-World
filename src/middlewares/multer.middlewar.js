import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp") //folder name where you want to keepp
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname) 
    }
  })
  
export const upload = multer({ 
    storage, // storage : storage (beacuse of ES6 can be written as storage,)
})