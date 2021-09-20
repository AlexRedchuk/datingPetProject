const multer = require('multer');
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = Router();
const uuidv4 = require('uuid');
const auth = require('../middlewares/auth');
const fs = require('fs')
const { promisify } = require('util');
const decodeUserId = require('../utils/decodeToken');
require('dotenv').config();
const {Types} = require('mongoose');
const unlinkAsync = promisify(fs.unlink)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4.v4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.get('/', auth, async (req, res) => {
    await User.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.status(200).send(items);
        }
    });
});

router.get('/:id', auth, async (req, res) => {
    await User.findById(req.params.id, (err, user) => {
        if(err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.status(200).send(user);
        }
    })
})
    
router.delete('/:id', auth, async (req, res) => {
    try {
        const usertoDelete = await User.findOne({_id: req.params.id});
        await User.findByIdAndDelete(req.params.id, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send('An error occurred', err);
            }
            else {
                const url = req.protocol + '://' + req.get('host') + '/uploads/';
                const photos = usertoDelete.photos;
                const photosToDelete = photos.map(el => {
                    return el.replace(url, 'uploads\\')
                })
                photosToDelete.forEach(el => {
                    unlinkAsync(el);
                })
                res.status(200).send(data);
            }
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong, try later"
        })
    }
    
})

router.post(
    '/register',
    [
        upload.array('photos'),
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Minimum password length is 6').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.files.forEach(el => {
                    unlinkAsync(el.path);
                })
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect registration data'
                })
            }
            const {email, password} = req.body;
            
            const url = req.protocol + '://' + req.get('host');
            const photoUrls = req.files.map(element => {
                return url + '/uploads/' + element.filename
            });
            const hashedPassword = await bcrypt.hash(password, 12);
            const id = Types.ObjectId();
            const obj = {
                _id: id,
                name: req.body.name,
                dateOfBirth: req.body.dateOfBirth,
                city: req.body.city,
                phone: req.body.phone,
                email: req.body.email,
                gender: req.body.gender,
                googleId: req.body.googleId,
                password: hashedPassword,
                photos: photoUrls,
                skippedPool: [id.toHexString()]
            }
            const candidate = await User.findOne({ email })

            if (candidate) {
                return res.status(400).json({ message: 'Email is already in use' })
            }

            const user = new User(obj)
            await user.save();
            res.status(201).json(req.body);
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: "Something went wrong, try later"
            })
        }


    });

    router.post(
        '/registerGoogle',
        [
            upload.array('photos'),
            check('email', 'Incorrect email').isEmail()
        ],
        async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    req.files.forEach(el => {
                        unlinkAsync(el.path);
                    })
                    return res.status(400).json({
                        errors: errors.array(),
                        message: 'Incorrect registration data'
                    })
                }
                
                const url = req.protocol + '://' + req.get('host');
                const photoUrls = req.files.map(element => {
                    return url + '/uploads/' + element.filename
                });
                const id = Types.ObjectId();
                const obj = {
                    _id: id,
                    name: req.body.name,
                    dateOfBirth: req.body.dateOfBirth,
                    city: req.body.city,
                    phone: req.body.phone,
                    email: req.body.email,
                    gender: req.body.gender,
                    googleId: req.body.googleId,
                    photos: photoUrls,
                    skippedPool: [id]
                }
    
                const user = new User(obj)
                await user.save();
                res.status(201).json(user);
            } catch (e) {
                console.log(e);
                res.status(500).json({
                    message: "Something went wrong, try later"
                })
            }
    
    
        });

router.post(
    '/googleAuth',
    async (req, res) => {
        try {
            const user = await User.findOne({googleId: req.body.googleId});
            if(user) {
                const secret = process.env.JWT_SECRET
                const token = jwt.sign(
                    { userId: user.id },
                    secret,
                    { expiresIn: '3600s' }
                );
    
                res.json({
                    token, userId: user.id, expiresIn: '3600'
                })
            }
            else {
                res.json('Unregistered');
            }
        } catch (error) {
            
        }
    }
)
router.post(
    '/login',
    [
        check('email', 'Enter correct email').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req.body);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect login data'
                })
            }

            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Wrong email ' })
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Wrong  password' })
            }
            const secret = process.env.JWT_SECRET
            const token = jwt.sign(
                { userId: user.id },
                secret,
                { expiresIn: '3600s' }
            );

            res.json({
                token, userId: user.id, expiresIn: '3600'
            })

        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: "Что-то пошло не так, попробуйте позже"
            })
        }
    });

// router.get('/userid/:token', async (req, res) => {
//     try {
//         const secret = process.env.JWT_SECRET
//         let decoded = await jwt_decode(req.params.token, secret);
//         res.status(200).json(decoded.userId);
//     } catch (e) {
//         console.log(e);
//         res.status(500).json({
//             message: "Что-то пошло не так, попробуйте позже"
//         })
//     }
// })


router.post('/deletePhotos', async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userId = decodeUserId(token);
        const url = req.protocol + '://' + req.get('host') + '/uploads/';
        const photos = req.body.photos;
        const photosToDelete = photos.map(el => {
            return el.replace(url, 'uploads\\')
        })
        photosToDelete.forEach(el => {
            unlinkAsync(el);
        })
        User.updateOne({ _id: userId }, { $pull: { photos: { $in: req.body.photos } } }, (error, data) => {
            if (error) {
                console.log(error);
                return next(error);
            } else {
                res.json(data);
            }
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Something went wrong, try later"
        })
    }
})

router.post('/addPhotos', upload.array('photos'), async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userId = decodeUserId(token);
        const url = req.protocol + '://' + req.get('host');
        const photoUrls = req.files.map(element => {
            return url + '/uploads/' + element.filename
        });
        User.updateOne({ _id: userId }, { $push: { photos: photoUrls } }, (error, data) => {
            if (error) {
                console.log(error);
                return next(error);
            } else {
                res.json(data);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong, try later"
        })
    }
})




module.exports = router;