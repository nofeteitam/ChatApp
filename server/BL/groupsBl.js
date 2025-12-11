const GroupModel = require("../models/groupModel");

exports.createGroup = async (name, members) => {
    try {
        const newGroup = new GroupModel({
            name,
            members,
            messages: []
        });
        await newGroup.save();
        return newGroup;
    } catch (err) {
        return "Error creating Group : " + error.message;
    }

};

exports.getGroupHistory = async (id) => {
    try {
        const group = await GroupModel.findById(id);
        return group;
    } catch (err) {
        return "Error getGroupHistory :" + err.message;
    }
};

exports.getAllGroups = async () => {
    try {
        // console.log("we here GET all groups 2")
        const groups = await GroupModel.find().populate("members", "username avatar");
        return groups;
    } catch (err) {
        // console.log("we here GET all groups 2" + err.message);
        return "Error getAllGroups :" + err.message;
       
    }
};