const express = require("express");
const { authToken } = require("../middlewares/auth");
const { ToyModel, validateToy } = require("../models/toyModel")
const router = express.Router();

router.get("/", async (req, res) => {
    let perPage = req.query.perPage || 10;;
    let page = req.query.page || 1;

    try {
        let data = await ToyModel.find({})
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ _id: -1 })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.get("/single/:id", async (req, res) => {
    try {
        let data = await ToyModel.findOne({ _id: req.params.id });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.get("/search", async (req, res) => {
    try {
        let queryS = req.query.s;
        let perPage = req.query.perPage || 10;;
        let page = req.query.page || 1;
        let searchReg = new RegExp(queryS, "i");
        console.log(searchReg)
        let data = await ToyModel.find({ $or: [{ name: searchReg }, { info: searchReg }] })
            .limit((page - 1) * perPage)
            .skip((page - 1) * perPage)
            .sort({ _id: -1 });

        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.get("/prices", async (req, res) => {
    try {
        let min = req.query.min;
        let max = req.query.max;
        let perPage = req.query.perPage || 10;;
        let page = req.query.page || 1;
        let sort = req.query.sort || "price";
        let reverse = req.query.reverse == "yes" ? -1 : 1;

        if (min && max) {
            let data = await ToyModel.find({ $and: [{ price: { $gte: min } }, { price: { $lte: max } }] })

                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse })
            res.json(data);
        }
        else if (max) {
            let data = await ToyModel.find({ price: { $lte: max } })
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse })
            res.json(data);
        } else if (min) {
            let data = await ToyModel.find({ price: { $gte: min } })
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse })
            res.json(data);
        } else {
            let data = await ToyModel.find({})
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse })
            res.json(data);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.get("/category/:catName", async (req, res) => {
    try {
        let category = req.params.catName;
        let perPage = req.query.perPage || 10;;
        let page = req.query.page || 1;
        let searchReg = new RegExp(category, "i");

        let data = await ToyModel.find({ category: searchReg })
            .limit((page - 1) * perPage);

        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.post("/", authToken, async (req, res) => {
    let validBody = validateToy(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let cake = new ToyModel(req.body);
        cake.user_id = req.tokenData._id;
        await cake.save();
        res.status(201).json(cake);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})


router.put("/:editId", authToken, async (req, res) => {
    let validBody = validateToy(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let editId = req.params.editId;
        let data = await ToyModel.updateOne({ _id: editId, user_id: req.tokenData._id }, req.body)
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.delete("/:delId", authToken, async (req, res) => {
    try {
        let delId = req.params.delId;
        let data = await ToyModel.deleteOne({ _id: delId, user_id: req.tokenData._id })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

module.exports = router;