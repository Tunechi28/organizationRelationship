
const express = require('express');
const router = express.Router();
const organization =  require('../services/organizationService');
const relationship =  require('../services/relationshipService');

const _ = require('lodash')

router.get('/:org',  async function(req, res, next) {
    try {
        let orgName = decodeURI(req.params['org'])
        let orgData =  await organization.getOrganizationByOrgName(orgName).then((data) => {
            return data
        })

        if(!_.isEmpty(orgData)) {
            let parents;
            let daughters;
            let sisters;
            let parentsId = [];
            let orgId = orgData[0].org_id

            await relationship.getParentRelationship(orgId).then((data) => {
                parents = data
            })
            await relationship.getDaughterRelationship(orgId).then((data) => {
                daughters = data
            })

            parents.forEach((parent) => {
                parentsId.push(parent.r_org_id)

            });
            await relationship.getSisterRelationship(parentsId, orgId).then((data) => {
                sisters = data
            })

            let org_data = {
                main: orgData,
                daughters: daughters,
                parents: parents,
                sisters: sisters,

            }


            res.send(org_data)


        }else{
            res.send('organization does not exist')
        }


    } catch (err) {
        return res.status(400).json(`Error while fetching donors ${err.message}`)
    }
});


router.post('/new',  async function(req, res, next) {
    try {

        let tree = [
          req.body
        ];

        let flatOrganizations = flatten(tree)
        for (const flatOrganization of flatOrganizations) {
            let parentId

            let daughterId
            let relationshipDatum
            parentId = await addOrFind(flatOrganization.parent.org_name).then()
              if (_.isArray(flatOrganization.daughters) && !_.isEmpty(flatOrganization.daughters)) {
                let daughters = flatOrganization.daughters
                for(const daughter of daughters){
                    daughterId =  await addOrFind(daughter.org_name)
                    if(daughterId){
                        let relationshipData = {
                            r_org_id: parentId,
                            r_daughter_id: daughterId,
                        }

                        await relationship.addRelationship(relationshipData).then((data)=>{
                            return data
                        })

                    }

                }

               }


        }





        res.send('i saved')





       // res.send(parentId)
        // let parents = req.body ;
        // let daughters = req.body.daughters;
        // let org = req.body.organization;
        //
        // let parentsId = [];
        // let daughtersId = [];
        //
        // await organization.addOrganization(req.body).then((data) =>{
        //        res.send(data)
        //    })
        //
        // parents.forEach((parent) => {
        //      organization.addOrganization(parent).then((data) =>{
        //        parentsId.push(data.org_id)
        //      })
        //
        //
        //
        //
        //     this.nonSupervisors.push({
        //         value: employee.emp_id,
        //         text:`${employee.emp_first_name} ${employee.emp_last_name}`,
        //     });
        // });
        //
        //
        // daughters.forEach((daughter) => {
        //     organization.addOrganization(daughter).then((data) => {
        //         daughtersId.push(data.org_id)
        //     })
        // })



        //res.send(org_data)
    } catch (err) {
        return res.status(400).json(`${err.message}`)
    }
});

async function addOrFind(orgName){
let id;

let orgData =  await organization.getOrganizationByOrgName(orgName).then((data) => {
    return data
})
    if(_.isEmpty(orgData)){
        let org = {
            org_name: orgName
        }
     let addData = await  organization.addOrganization(org).then((orgAddResponse) => {
           return orgAddResponse
        })

        id =  addData.org_id
    }else{

       id = orgData[0].org_id

    }

    return id



}

function flatten(arr) {
    let flattened = []
    for(let i = 0; i < arr.length; i++){
        let newObject;
        if(arr[i].daughters){
            let children  = arr[i].daughters
            delete arr[i].daughters


            newObject = {
                'parent': arr[i],
                'daughters': children
            }

            flattened.push(newObject)
            if(_.isArray(children) && !_.isEmpty(children)){
                flattened = flattened.concat(flatten(children))
            } else{
                flattened.push(arr[i].daughters)
            }
        }else{
            newObject = {
                'parent': arr[i],

            }

            flattened.push(newObject)
        }


    }
    return flattened
}


//  app.post("/api/createorg", function(req, res) {
//     var body = '';
//     req.on('data', function(data) {
//         body += data;
//         // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~ 1MB
//         if (body.length > 1e6) {
//             req.connection.destroy();
//         }
//     });
//     req.on('end', function() {
//         process_request(body);
//     });
//     function process_request(body) {
//         // Continue with parsing json string in body and inserting organisation
//         // json string is stored in the body variable
//         var org = JSON.parse(body);
//         insert_organisation(org, 0);
//         res.end('INSERTED');
//     }
//
//     function insert_organisation(org, parent_id) {
//         // normally check if organisation exists
//         var firstQuery = "INSERT INTO orgs (org_name) VALUES (?) ON DUPLICATE KEY UPDATE org_name = VALUES(org_name), id=LAST_INSERT_ID(id)";
//         connection.query(firstQuery, [org.org_name], function(error, results, fields) {
//             if (error) {
//                 console.log(error);
//                 return;
//             }
//             // Insert relation if any
//             var new_parent_id = results.insertId;
//             if (new_parent_id && parent_id > 0) {
//                 var secondQuery = "INSERT INTO orgs_relation (org_id, parent_org_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE org_id = VALUES(org_id)";
//                 connection.query(secondQuery, [new_parent_id, parent_id], function(error, results, fields) {
//                     if (error) {
//                         console.log(error);
//                         return;
//                     }
//                     console.log(new_parent_id + ' - ' + parent_id + ' relation inserted');
//                 });
//             }
//             if (new_parent_id && org.daughters && org.daughters.length) {
//                 for (var i = 0; i < org.daughters.length; i++) {
//                     insert_organisation(org.daughters[i], new_parent_id);
//                 }
//             }
//             console.log(org.org_name + ' inserted!');
//         });
//     }
//
// });

module.exports = router;
