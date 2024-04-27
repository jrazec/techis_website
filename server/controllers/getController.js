const npcTable = require('../model/Npc');
const roomTable = require('../model/Classroom');
const questTable = require('../model/Quest');
const userTable = require('../model/Users');


exports.getNpc = async (req, res) => {
    console.log("Get Request")
    try {
        
        let npcDesigTable = await npcTable.findAll();

        // If the search button sends a get request, and there is a value or a digit
        if (req.query.search && !isNaN(req.query.search)) {
            npcDesigTable = await npcTable.findAll("SEARCH", req.query.search);
        }

        if (parseInt(req.query.limitCount) > 0) {
            npcDesigTable = await npcTable.findAll("LIMIT", "", parseInt(req.query.limitCount));
        }
        /*  - Content is the ejs file for quest page 
            - npcDesigTable is the table for above query, if errors, will send an object instead that has a value of error 
            - route is used in choice-options, to send the get request depending on which page the user is in */
        res.render('admin/index', { content: "quest", npcDesigTable, choice: "choice_container/choice-npc", route: "npc" });
    
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

exports.getSingleNpc = async (req,res)=>{
    console.log("Get Request id");
    try {
        let id = req.params.id;
        let npcDesigChoice = await npcTable.findSingle(parseInt(id));
        console.log(req.path)
        if (req.path === `/setup/npc/edit/${id}`) {
            res.render('admin/index', { content : "operations/update", npcDesigChoice , npcId : id, route : ""});
        } else if(req.path === `/setup/npc/delete/${id}`) {
            res.render('admin/index', { content : "operations/delete", npcDesigChoice , npcId : id, route : ""});
        }

    } catch(error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }

}


exports.getClassroom = async (req,res)=>{
    console.log("Get Classroom Request");
    try {
        let roomFloorBldgTable = await roomTable.findAll();

        // If the search button sends a get request, and there is a value or a digit
        if (req.query.search && !isNaN(req.query.search)) {
            roomFloorBldgTable = await roomTable.findAll("SEARCH", req.query.search);
        }

        if (parseInt(req.query.limitCount) > 0) {
            roomFloorBldgTable = await roomTable.findAll("LIMIT", "", parseInt(req.query.limitCount));
        }

            res.render('admin/index', { content : "quest", roomFloorBldgTable, choice : "choice_container/choice-classroom", route : "classroom"});  
    
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

    
}

exports.getQuest = async(req,res)=>{
    console.log("Get Quest Request");
    try {
        let questDesigTable = await questTable.findAll();

        // If the search button sends a get request, and there is a value or a digit
        if (req.query.search && !isNaN(req.query.search)) {
            questDesigTable = await questTable.findAll("SEARCH", req.query.search);
        }

        if (parseInt(req.query.limitCount) > 0) {
            questDesigTable = await questTable.findAll("LIMIT", "", parseInt(req.query.limitCount));
        }

        res.render('admin/index', { content : "quest", questDesigTable, choice : "choice_container/choice-quest", route : "quest"});  
    
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// ------------------------------------------ USERS ------------------------------------------
exports.retriveUser = async(req,res)=>{
    try {
        let userRecords = await userTable.retrieveRecords(req.params.id);
        res.render('user/gamebase', { userRecords : userRecords});
    } catch(error) {
        console.error(error);
    }
}

exports.retriveUserJson = async(req,res)=>{
    try {
        let userRecords = await userTable.retrieveRecords(req.params.id);
        let userAvatar = await userTable.retrieveUserAvatar(req.params.id);
        let facilities = await userTable.retrieveFacilites();

        res.json({userRecords,facilities,userAvatar});
    } catch(error) {
        console.error(error);
    }
}

exports.loginUser =async(req,res)=>{
    try {
        console.log("suc")
        if(req.query.email === undefined || req.query.pass === undefined){
            res.render('user/user-login');
        }else {
            console.log()
            let user = await userTable.searchUser(String(req.query.email),String(req.query.pass));
            console.log(user.length)
            if(user.length === 0){
                res.render('user/user-login');
            }else {
                console.log(user)
                //session
                res.redirect(`/user/${user[0].user_id}`);
            }
        }
    } catch(error) {
        console.log(error)
    }
}