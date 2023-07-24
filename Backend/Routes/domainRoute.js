const express=require("express");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");
const { createDomainController, updateDomainController, getAllDomains, getSingleDomain, deleteDomain } = require("../Controllers/domainController");


const router=express.Router();
//routes
//create domain
router.post('/create-domain',requireSignIn,isAdmin,createDomainController);

//update domain
router.put('/update-domain/:id',requireSignIn,isAdmin,updateDomainController)

//get all domain
router.get('/domains',getAllDomains)
//get a single domain
router.get('/domain/:id',getSingleDomain)

//delete a domain
router.delete('/delete-domain/:id',requireSignIn,isAdmin,deleteDomain)

module.exports=router