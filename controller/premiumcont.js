const User = require('../models/users');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');

exports.getpremium = async (req, res) => {
    try {
        const user = await User.find({
            id: req.user._id
        });
        res.status(200).json(user);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching expenses.');
    }
};

