const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

// Init upload
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

//Check File Type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    //Check the extensions
    const extName = filetypes.test(path.extname(file.originalname).toLowerCase());
    //Check mime
    const mimeType = filetypes.test(file.mimetype);

    if(mimeType && extName) {
        return cb(null, true);
    } else {
        cb('Error: Images only!');
    }
}

//init app
const app = express();

//EJS
app.set('view engine', 'ejs');

//Public folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else{
            if(req.file == undefined) {
                res.render('index', {
                    msg: 'Error: no file selected'
                })
            } else{
                console.log(req.file);
                res.render('index', {
                    msg: 'File uploaded',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    });
});

const port = 5000;

app.listen(port, ()=> console.log(`Server started on port ${port}`));
