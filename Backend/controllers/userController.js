const um = require("../models/usermodels");

const getAllUsers = async (req, res) => {
    try {
        const users = await um.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await um.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
        res.json({ msg: "User role updated", user });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        await um.findByIdAndDelete(req.params.id);
        res.json({ msg: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

module.exports = { getAllUsers, updateUserRole, deleteUser };
