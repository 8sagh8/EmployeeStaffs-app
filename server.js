/*******************************************************************
  * WEB322 – Assignment 04
  * I declare that this assignment is my own work
   in accordance with Seneca Academic Policy. 


// setting up requires
const express = require("express"); 
const app = express();

//setting up handlebar
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },

        equal: function (lvalue, rvalue, options) {
                if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
                if (lvalue != rvalue) {
                 return options.inverse(this);
                } 
                else {
                  return options.fn(this);
                } 
        }

    } 
}));
app.set('view engine', '.hbs');

const path = require("path");
const data = require("./data-service.js");
const multer = require("multer");
const fs = require("fs");
const bodyParser= require("body-parser");



// to access body parser
app.use(bodyParser.urlencoded({extended : true}));

// to access static css and js files
app.use(express.static('public'));

//creating storage variable
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",

    filename: function(req,file,cb){
        cb(null, Date.now()+ path.extname(file.originalname));
    }
});


const upload = multer({storage: storage});

//add the property "activeRoute" to "app.locals"
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
    });


//set up 'routes' to listen on the default
app.get("/",function (req,res){
   res.render('home');
    // res.sendFile(path.join(__dirname,"/views/home.html"));
});

//'route' set up for About page
app.get("/about", function(req,res){
    res.render('about')
    
});

//'route' set up for add Employee page
app.get ("/employees/add",(req,res)=>{
    res.render('addEmployee')
});

//'route' set up for add Images
app.get("/images/add",(req,res)=>{
    res.render('addImage')
});


//'route' set up for Employees page and queries
app.get ("/employees",(req,res)=>{
   if (req.query.status){
       data.getEmployeesByStatus(req.query.status)
       .then((_status)=>{
        res.render("employees",{employees: _status});
    })
    .catch((err)=>{
         res.render("employees",{message: "No Result Return"});
    });
    }

   else if (req.query.department){
        data.getEmployeesByDepartment(req.query.department)
        .then((_department)=>{
            res.render("employees",{employees: _department});
        })
        .catch((err)=>{
             res.render("employees",{message: "No Result Return"});
        });
        
    }

   else if (req.query.manager){
     data.getEmployeesByManager(req.query.manager)
            .then((_manager)=>{
                res.render("employees",{employees: _manager});
            })
            .catch((err)=>{
                res.render("employees",{message: "No Result Return"});
            });
    }

    else {
        data.getAllEmployees()
            .then((_emp)=>{
            res.render("employees", {employees: _emp});
            })
            .catch((err)=>{
                res.render("employees",{message: "No Result Return"});
        });
    }    
    
});



//'route' set up for employee by value
app.get("/employee/:empNum",(req,res)=>{
    if (req.params.empNum){
        data.getEmployeeByNum(req.params.empNum)
        .then((_empWithNum)=>{
            res.render("employee", { employee: _empWithNum});
        }) 
        .catch((err)=> {
            res.render("employee",{message:"no results"});
        });
    }
});

 
//'route' set up for departments page
app.get ("/departments",(req,res)=>{
    data.getDepartments()
    .then((_departments)=>{
        res.render("departments", {departments: _departments});
    })
    .catch((err)=>{
        res.render("departments", {message: "No Results Found"});
    });
});


//'route' Get for images
app.get("/images",(req,res)=>{
    fs.readdir("./public/images/uploaded",(err,images)=>{
        res.render("images", {"image": images});
    });
});

//'route' POST for images
app.post("/images/add", upload.single("imageFile"),(req,res)=>{
    data.addImage(req.body).then(()=>{
            res.redirect("/images");
    });

});

//'route' POST for adding new employees
app.post("/employees/add",(req,res)=>{
    data.addEmployee(req.body).then(()=>{
        res.redirect("/employees");
    });
});

//'route' POST for updating employee info
app.post("/employee/update", (req, res) => { 
    data.updateEmployee(req.body)
    .then(()=>{
        res.redirect("/employees");
    });
    
});

// Personalized message incase page does not exist
app.use((req,res)=>{
    res.status(404).send("Page do not exist");
});

// Creating PORT
var HTTP_PORT = process.env.PORT || 8080;

// setup http server to listen on HTTP_PORT

function onHTTPSTART(){
    console.log("Express http server listening on: " + HTTP_PORT);
};

//calling initialize function before server run
data.initialize().then(function(){
       app.listen(HTTP_PORT, onHTTPSTART);
}).catch(function(err){
   console.log("Server is unable to start: " + err);
});
