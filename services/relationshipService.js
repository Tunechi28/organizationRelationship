const { QueryTypes, Op } = require('sequelize')
const { sequelize, Sequelize } = require('./db');
const relationship = require("../models/relationship")(sequelize, Sequelize.DataTypes)
const _ = require('lodash')


async function addRelationship(relationshipData){


    return await relationship.create({
        r_org_id: relationshipData.r_org_id,
        r_daughter_id: relationshipData.r_daughter_id,

    });
}


async function getParentRelationship(org_id){


    return await relationship.findAll({
        attributes: ['r_org_id'],
        include: ['parent'],
        where: {
            r_daughter_id: org_id
        },
    });
}

async function getDaughterRelationship(org_id){
    return await relationship.findAll({
        attributes: ['r_daughter_id'],
        where: {
            r_org_id: org_id
        },
        include: ['daughter']
    });
}

async function getSisterRelationship(org_id, main_org_id){
    return await relationship.findAll({
        attributes: ['r_daughter_id'],
        where: {
            //r_org_id: org_id,
            r_org_id: {

                [Op.in]: org_id,

            },

            r_daughter_id: {

                [Op.ne]: main_org_id

            }

        },
        include: ['daughter']
    });
}



// async function flatten(treeObj, idAttr, parentAttr, childrenAttr, levelAttr) {
//     if (!idAttr) idAttr = 'id';
//     if (!parentAttr) parentAttr = 'parent';
//     if (!childrenAttr) childrenAttr = 'children';
//     if (!levelAttr) levelAttr = 'level';
//
//     function flattenChild(childObj, parentId, level) {
//         let array = [];
//
//         let childCopy = Object.assign({}, childObj);
//         childCopy[levelAttr] = level;
//         childCopy[parentAttr] = parentId;
//         delete childCopy[childrenAttr];
//         array.push(childCopy);
//
//         array = array.concat(processChildren(childObj, level));
//
//         return array;
//     }
//
//     function processChildren(obj, level) {
//         if (!level) level = 0;
//         let array = [];
//
//         obj[childrenAttr].forEach(function(childObj) {
//             array = array.concat(flattenChild(childObj, obj[idAttr], level+1));
//         });
//
//         return array;
//     }
//
//     return processChildren(treeObj);
// }

// async function flatten(treeObj, idAttr, parentAttr, childrenAttr, levelAttr) {
//     if (!idAttr) idAttr = 'id';
//     if (!parentAttr) parentAttr = 'parent';
//     if (!childrenAttr) childrenAttr = 'children';
//     if (!levelAttr) levelAttr = 'level';
//
//     function flattenChild(childObj, parentId, level) {
//         let array = [];
//
//         let childCopy = Object.assign({}, childObj);
//         childCopy[levelAttr] = level;
//         childCopy[parentAttr] = parentId;
//         delete childCopy[childrenAttr];
//         array.push(childCopy);
//
//         array = array.concat(processChildren(childObj, level));
//
//         return array;
//     }
//
//     function processChildren(obj, level) {
//         if (!level) level = 0;
//         let array = [];
//
//         obj[childrenAttr].forEach(function(childObj) {
//             array = array.concat(flattenChild(childObj, obj[idAttr], level+1));
//         });
//
//         return array;
//     }
//
//     return processChildren(treeObj);
// }



 function flatten(arr) {
  let flattened = []
  for(let i = 0; i < arr.length; i++){
     if(!_.isEmpty(arr[i].children)){
         flattened = flattened.concat(flatten(arr[i]))
     } else{
         flattened.push(arr[i])
     }
    }
  return flattened
}


async function treeify(list, idAttr, parentAttr, childrenAttr) {
    if (!idAttr) idAttr = 'id';
    if (!parentAttr) parentAttr = 'parent';
    if (!childrenAttr) childrenAttr = 'children';

    let lookup = {};
    let result = {};
    result[childrenAttr] = [];

    list.forEach(function(obj) {
        lookup[obj[idAttr]] = obj;
        obj[childrenAttr] = [];
    });

    list.forEach(function(obj) {
        if (obj[parentAttr] != null) {
            lookup[obj[parentAttr]][childrenAttr].push(obj);
        } else {
            result[childrenAttr].push(obj);
        }
    });

    return result;
}


module.exports = {
    addRelationship,
    getDaughterRelationship,
    getParentRelationship,
    getSisterRelationship,
    flatten,
    treeify

}
