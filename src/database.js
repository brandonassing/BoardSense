var express = require("express");
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'boardsense'
});
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname));

conn.connect();
/*   USED FOR TESTING
conn.query('SELECT * FROM participation WHERE competitionName = "vitae diam."', function (err, rows, fields) {
    if (!err)
        console.log('The solution is: ', rows);
    else
        console.log('Error while performing Query.');
});
*/
app.get("/", function (req, res) {
    res.render("index.html");
});

//Insert a new snowboarder
app.post("/insertsnow", function (req, res) {
    //var ID = req.body.snowboarderID;
    var name = req.body.name;
    var height = req.body.height;
    var ridingStyle = req.body.ridingStyle;
    //console.log('You sent the ID "' +ID+'".\n');
    console.log('You sent the name "' + name + '".\n');
    console.log('You sent the height "' + height + '".\n');
    console.log('You sent the riding style "' + ridingStyle + '".\n');
    conn.query("INSERT INTO Snowboarder VALUES (NULL,'" + name + "','" + height + "','" + ridingStyle + "')",
        function (err, result) {
            if (!err)
                console.log('Completed Insert');
            else
                console.log('Error while performing Query.');
        });
});

//Insert a new competition.
app.post("/newcomp", function (req, res) {
    var newcomp = req.body.newcomp;
    var compYear = req.body.compYear;
    var tier = req.body.tier;
    var mountainName = req.body.mountainName;
    console.log('Checking if the mountain exists');
    conn.query('SELECT * FROM mountain WHERE mountainName = "' + mountainName + '"', function (err, result) {
        if (!err)
            if (result.length > 0) {
                if (result) {
                    console.log("Mountain Exists");
                    console.log('You created the competition: "' + newcomp + '".\n');
                    conn.query("INSERT INTO competition VALUES ('" + newcomp + "','" + compYear + "','" + tier + "','" + mountainName + "')", function (err, result) {
                        if (!err)
                            console.log('Completed Insert');
                        else
                            console.log('Error while performing Query.');
                    });
                }
            } else
                window.alert("Mountain Doesnt exist");
    });

});

//Given a snowboarder name, find all the competitions participated in as well as the board used. 
app.post("/findboarder", function (req, res) {
    var name = req.body.name;
    console.log('You send the name "' + name + '".\n');
    conn.query('SELECT * FROM snowboarder WHERE name = "' + name + '"', function (err, result) {
        if (!err) {
            if (result.length > 0) {
                if (result) {
                    console.log("Snowboarder Exists");
                    console.log('Look for information about: "' + name + '".\n');
                    conn.query('SELECT * FROM snowboarder s JOIN participation p ON p.snowboarderID = s.snowboarderID WHERE s.snowboarderID IN (SELECT snowboarderID FROM snowboarder WHERE name = "' + name + '")', function (err, rows, fields) {
                        if (!err) {
                            res.json(rows);
                            console.log('Completed Query');
                        } else
                            console.log('Error while performing Query.');
                    });
                }
            } else
                console.log("Snowboarder Doesnt exist");
        }
    });
});

//Count number of participants for related competition
app.post("/partino", function (req, res) {
    var competitionName = req.body.competitionName;
    var competitionYear = req.body.competitionYear;
    conn.query('SELECT COUNT(*) AS participantCOUNT FROM participation WHERE competitionName =  "' + competitionName + '" AND competitionYear = "' + competitionYear + '"', function (err, rows, fields) {
        if (!err) {
            console.log('Completed Count');
            res.json(rows);
        } else
            console.log('Error while performing Query.');
    });
});

//find all participants of a given competition
app.post("/findpart", function (req, res) {
    var competitionName = req.body.competitionName;
    var competitionYear = req.body.competitionYear;
    conn.query('SELECT * FROM competition WHERE competitionName = "' + competitionName + '" AND competitionYear = "' + competitionYear + '"', function (err, result) {
        if (!err) {
            if (result.length > 0) {
                if (result) {
                    conn.query('SELECT * FROM participation p JOIN snowboarder s ON p.snowboarderID = s.snowboarderID WHERE competitionName = "' + competitionName + '" AND competitionYear = "' + competitionYear + '"', function (err, rows, fields) {
                        if (!err) {
                            console.log("Completed Query");
                            res.json(rows);
                        } else {
                            console.log("Error with Query");
                        }
                    });
                }
            } else {
                console.log("Competition doesn't exist");
            }

        }
    });
});

//Update a competition with certain boards
app.post("/updpart", function (req, res) {
    var brand = req.body.brand;
    var model = req.body.model;
    var yearMade = req.body.yearMade;
    var competitionYear = req.body.competitionYear;
    var competitionName = req.body.competitionName;
    conn.query('SELECT * FROM boardused WHERE brand = "' + brand + '" AND model = "' + model + '" AND yearMade = "' + yearMade + '"', function (err, result) {
        if (!err) {
            if (result.length > 0) {
                if (result) {
                    conn.query('SElECT * FROM competition WHERE competitionYear = "' + competitionYear + '" AND competitionName = "' + competitionName + '"', function (err, result) {
                        if (!err) {
                            if (result.length > 0) {
                                if (result) {
                                    conn.query('UPDATE participation SET brand = "' + brand + '", model = "' + model + '", yearMade = "' + yearMade + '" WHERE competitionYear = "' + competitionYear + '" AND competitionName = "' + competitionName + '"', function (err, result) {
                                        if (!err) {
                                            console.log('Update Successfully');
                                        } else
                                            console.log("Update has failed");
                                    });
                                }
                            } else
                                console.log("Competition doesn't exist");
                        }
                    });
                }
            } else
                console.log("Board doesn't exist");
        }
    });
});

app.post("/registercomp", function (req, res) {
    var snowboarderID = req.body.snowboarderID;
    var competitionName = req.body.competitionName;
    var competitionYear = req.body.competitionYear;
    var brand = req.body.brand;
    var model = req.body.model;
    var yearMade = req.body.yearMade;
    var category = req.body.categoryName;
    var score = req.body.result;
    conn.query('SELECT * FROM snowboarder WHERE snowboarderID = "' + snowboarderID + '"', function (err, result) {
        if (!err) {
            if (result.length > 0) {
                if (result) {
                    conn.query('SELECT * FROM competition WHERE competitionName = "' + competitionName + '" AND competitionYear = "' + competitionYear + '"', function (err, result) {
                        if (!err) {
                            if (result.length > 0) {
                                if (result) {
                                    conn.query('SELECT * FROM boardUsed WHERE brand = "' + brand + '" AND model = "' + model + '" AND yearMade = "' + yearMade + '"', function (err, result) {
                                        if (!err) {
                                            if (result.length > 0) {
                                                if (result) {
                                                    conn.query('INSERT INTO participation VALUES (NULL, "' + score + '", "' + competitionName + '", "' + competitionYear + '", "' + category + '", "' + snowboarderID + '", "' + brand + '", "' + model + '", "' + yearMade + '")', function (err, result) {
                                                        if (!err) {
                                                            console.log('Registration Successful');
                                                        } else {
                                                            console.log(err);
                                                        }
                                                    });
                                                }
                                            } else
                                                console.log('Board does not exist!');
                                        } else console.log('Error Performing Query');
                                    });
                                }
                            } else
                                console.log('Competition does not exist!');
                        } else console.log('Error Performing Query');
                    });
                }
            } else
                console.log('Snowboarder does not exist!');
        } else console.log('Error Performing Query');
    });
});

app.post('/getid', function (req, res) {
    var name = req.body.name;
    conn.query('SELECT snowboarderID FROM snowboarder WHERE name="' + name + '"', function (err, rows, field) {
        if (!err) {
            //if (result.length > 0) {
            //if (result) {
            res.json(rows);
            // }
            // } else console.log('Snowboarder does not exist');
        } else console.log('Error with the Query');
    });
});

app.get("/quit", function (req, res) {
    conn.end();
});

app.listen(8080);
