/*************************************************************************
  * WEB322 – Assignment 04
  * I declare that this assignment is my own work
   in accordance with Seneca Academic Policy. 
   No part of this assignment has been copied manually 
   or electronically from any other source 
   (including 3rd party web sites) or distributed to other students.
   * Name: Dure Shawar Abbas 
     Student ID: 010109148
     Date:12/11/2020 
     Online(Heroku)Link: https://abbas-webassi4.herokuapp.com/
***************************************************************************/
const fs = require("fs");
const { resolve } = require("path");
const ser = require("./server.js")

//global declaration of arrays
let employees = [];
let departments = [];
let images = [];


//Initialize function to read content of json files
module.exports.initialize = function(){
    return new Promise ((resolve, reject) =>{
        fs.readFile("./data/employees.json",(err,data)=>{
            if(err){
                reject(err);
            }
            employees = JSON.parse(data); // will convert json data into javascript object
            resolve();
        });
        fs.readFile("./data/departments.json",(err,data)=>{
            if(err){
                reject(err);
            }
            departments = JSON.parse(data); // will convert json data into javascript object
            resolve();
        });
    });
}

//function to provide array of all the employees
module.exports.getAllEmployees = function(){
    return new Promise((resolve, reject)=>{
        if(employees.length == 0){
            reject("No Results Returned");
        }
        resolve(employees);
    });
}

//function that get employees whose isManager is true
module.exports.getManagers = function(){
    return new Promise(function(resolve,reject){
        var empManager = [];

        for (let i = 0; i < employees.length; i++){
            if(employees[i].isManager == true){
                empManager.push(employees[i]);
            }
        }

        if(empManager.length == 0){
            reject("No Results Returned")
        }
        resolve(empManager);
    });
}

//function to get employees by status
module.exports.getEmployeesByStatus = function(status){
    return new Promise((resolve,reject)=>{
        var empStatus = [];
        for (let i = 0; i < employees.length; i++){
            if (employees[i].status == status){
                empStatus.push(employees[i]);
            }
        }
    
        if (empStatus.length== 0){
            reject ("No Results")   
        }
        else {
            resolve(empStatus)  
        }     
    });
}

// function to get employees by department value
module.exports.getEmployeesByDepartment = function(department){
    return new Promise ((resolve, reject)=> {
        var empDepartments = [];
        for (let i = 0; i < employees.length; i++){
            if (employees[i].department == department){
                empDepartments.push(employees[i]);
            }
        }
        if (empDepartments.length == 0){
            reject("No results returned")
        }
        resolve(empDepartments)
       
    });
    
}

//function to get employees by Manager num
module.exports.getEmployeesByManager = function(manager){
    return new Promise ((resolve, reject)=> {
        var _empManagerNum = [];
        for (let i = 0; i < employees.length; i++){
            if (employees[i].employeeManagerNum == manager){
                _empManagerNum.push(employees[i]);
            }
        }
        if (_empManagerNum.length == 0){
            reject("No results returned")
        }
        resolve(_empManagerNum)
    });
}

//function to get employee by employeeNum
module.exports.getEmployeeByNum = function(num){
    return new Promise ((resolve, reject)=> {
        var _empNum = [];
        for (let i = 0; i < employees.length; i++){
            if (employees[i].employeeNum == num){
                _empNum = employees[i];
            }
        }
        
        if (_empNum.length == 0){
            reject("No results returned")
        }

        resolve(_empNum)

    });
}

//Function to provide all the departments
module.exports.getDepartments = function(){
    return new Promise((resolve, reject)=>{
        if(departments.length == 0){
            reject("No Results returned by query")
        }
        resolve(departments)
    });
}

//function to add new employee
module.exports.addEmployee = function (employeeData){
    return new Promise (function(resolve, reject){
        employeeData.employeeNum = employees.length +1;
        employeeData.isManager = (employeeData.isManager) ? true : false;
        

        employees.push(employeeData);

        resolve();

    });

};

//function to update employee
module.exports.updateEmployee = function (employeeData){
    console.log(employeeData.employeeNum);
    return new Promise (function(resolve, reject){
        
        for (let i=0; i < employees.length; i++){
            if (employees[i].employeeNum == employeeData.employeeNum){
                employees[i] = employeeData;
            }
        }

        employees.push(employeeData);

        resolve();

    });

};
// function to add new image
module.exports.addImage = function(imageData){
    return new Promise(function(resolve,reject){

        images.push(imageData);

        resolve();

    });


}




