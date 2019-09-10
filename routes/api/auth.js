const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
// @route GET api/auth
// @desc  Test route
// @acess Public

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.log('err in auth.js', err.message);
        res.status(500).send('Server Error');
    }
});

// @route  POST api/auth
// @desc   Authenticate user & get token
// @access Public

router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check(
            'password',
            'Password is required').exists()
    ],
    async (req, res) => {
        // console.log("req.body in users.js", req.body);
        const errors = validationResult(req);
        //if the field is empty,send status 400.
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if(!user) {
                return res
                    .status(400)
                    .json({ errors: [ { msg: 'Invalid Crendentials' }]});
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [ { msg: 'Invalid Crendentials' }]});
            }

            //Get payLoad which includes the user.id
            const payload = {
                user: {
                    id: user.id
                }
            };

            //sign the token, pass the payload, inside callback-get error or token
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if(err) throw err;
                    res.json({ token });
                }
            );

        } catch(err) {
            console.log('err in users.js', err.message);
            res.status(500).send('Server error');
        }


    });

module.exports = router;
