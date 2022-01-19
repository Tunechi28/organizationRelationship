const { QueryTypes } = require('sequelize')
const { sequelize, Sequelize } = require('./db');
const organization = require("../models/organization")(sequelize, Sequelize.DataTypes)



async function addOrganization(orgData){


    return  await organization.create({
        org_name: orgData.org_name,

    });
}

async function getOrganizations(){


    return await organization.findAll();
}

async function getOrganizationByOrgName(orgName){
    return  await organization.findAll({ where:{
        org_name: orgName
        }
    });
}




module.exports = {
    addOrganization,
    getOrganizations,
    getOrganizationByOrgName
}
