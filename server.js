const express = require('express');
const pg = require("pg");
const app = express();

var conString = 'postgres://postgres:1968@localhost:5432/TpPrweb';

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-Type, Accept");
    next();
});

// Vérifier l'authentification : 
app.post("/identify", function(req, res) {
    var login = req.body.login;
    var passwd = req.body.passwd;


    var jsonString;
    if ((login === "admin") && (passwd === "admin")) {
        jsonString = JSON.stringify({ok:1});
    } else {
        jsonString = JSON.stringify({ok:0});
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(jsonString);
});

// Executer une requête SQL : 
function getSQLResult(req, res, sqlRequest, values) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            // Cannot connect 
            console.error('cannot connect to postgres', err);
            res.status(500).end('Database connection error!');
        } else {
            client.query(sqlRequest, values, function(err, result) {
                if (err) {
                    // Request fails
                    console.error('bad request', err);
                    res.status(500).end('Bad request error !');
                } else {
                    // Build result
                    var results = [];
                    for (var ind in result.rows) {
                        results.push(result.rows[ind]);
                    }
                    jsonString = JSON.stringify(results);
                    res.setHeader('Content-Type', 'application/json');
                    res.send((jsonString));
                }
                client.end();
            });
        }
    });
};

function getSQLResult2(req, res, sqlRequest, values, sqlRequest2, values2) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            // Cannot connect
            console.error('cannot connect to postgres', err);
            res.status(500).end('Database connection error!');
        } else {
            client.query(sqlRequest, values, function(err, result) {
                if (err) {
                    // request fails
                    console.error('bad request', err);
                    res.status(500).end('Bad request error!');
                    client.end();
                } else {
                    client.query(sqlRequest2, values2, function(err, result) {
                        if (err) {
                            // request fails
                            console.error('bad request', err);
                            res.status(500).end('Bad request error!');
                        } else {
                            // Build result
                            var results = [];
                            for (var ind in result.rows) {
                                results.push(result.rows[ind]);
                            }
                            jsonString = JSON.stringify(results);
                            res.setHeader('Content-Type', 'application/json');
                            res.send(jsonString);
                        }
                        client.end();
                    });
                }
            });
        }
    });
}

// récuperer la liste des personnes : 
app.post("/users", function(req, res) {
    var sqlRequest = "SELECT * FROM Person ORDER BY Person_LastName, Person_FirstName";
    var values = [];
    getSQLResult(req, res, sqlRequest, values);
});

// récuperer une personne selon son ID : 
app.post("/user", function(req, res) {
    var person_id = req.body.person_id;
    var sqlRequest = "SELECT * FROM Person WHERE Person_ID=$1";
    var values = [person_id];
    getSQLResult(req, res, sqlRequest, values);
});

// Ajouter/mettre à jour un utilisateur : 
app.post("/saveUser", function(req, res) {
    var person_id = req.body.person_id;
    var person_newId = req.body.person_newId;
    var person_firstname = req.body.person_firstname;
    var person_lastname = req.body.person_lastname;
    var person_birthdate = req.body.person_birthdate;

    var sqlRequest = "";
    var values = [];
    // We build a request that returns ID value to be able to return it
    if (person_id < 0) {
        sqlRequest = "INSERT INTO Person(Person_ID, Person_FirstName, Person_LastName, Person_BirthDate)"
        + " VALUES ($1, $2, $3, $4)"
        + " RETURNING Person_ID";
        values = [person_newId, person_firstname, person_lastname, person_birthdate];
    } else {
        sqlRequest = "UPDATE Person SET"
        + " Person_FirstName=$1, Person_LastName=$2, Person_BirthDate=$3"
        + " WHERE Person_ID=$4"
        + " RETURNING Person_ID";
        values = [person_firstname, person_lastname, person_birthdate, person_id];
    }
    getSQLResult(req, res, sqlRequest, values);
})

// supprimer un utilisateur selon son id : 
app.post("/deleteUser", function(req, res) {
    var person_id = req.body.person_id;
    var sqlRequest = "DELETE FROM Person WHERE Person_ID=$1";
    var values = [person_id];
    getSQLResult(req, res, sqlRequest, values);
});

// Même chose pour Book table : 

// récuperer la liste des personnes : 
app.post("/books", function(req, res) {
    var sqlRequest = "SELECT * FROM Book ORDER BY Book_Title";
    var values = [];
    getSQLResult(req, res, sqlRequest, values);
});

// récuperer une personne selon son ID : 
app.post("/book", function(req, res) {
    var book_id = req.body.book_id;
    var sqlRequest = "SELECT * FROM Book WHERE Book_ID=$1";
    var values = [book_id];
    getSQLResult(req, res, sqlRequest, values);
});

// Ajouter/mettre à jour un utilisateur : 
app.post("/saveBook", function(req, res) {
    var book_id = req.body.book_id;
    var book_newId = req.body.book_newId;
    var book_title = req.body.book_title;
    var book_authors = req.body.book_authors;

    var sqlRequest = "";
    var values = [];
    // We build a request that returns ID value to be able to return it
    if (book_id < 0) {
        sqlRequest = "INSERT INTO Book(Book_Id, Book_Title, Book_Authors)"
        + " VALUES ($1, $2, $3)"
        + " RETURNING Book_ID";
        values = [book_newId, book_title, book_authors];
    } else {
        sqlRequest = "UPDATE Book SET"
        + " Book_Title=$1, Book_Authors=$2"
        + " WHERE Book_ID=$3"
        + " RETURNING Book_ID";
        values = [book_title, book_authors, book_id];
    }
    getSQLResult(req, res, sqlRequest, values);
})

// supprimer un book : 
app.post("/deleteBook", function(req, res) {
    var book_id = req.body.book_id;
    var sqlRequest = "DELETE FROM Book WHERE Book_ID=$1";
    var values = [book_id];
    getSQLResult(req, res, sqlRequest, values);
});

// Pour borrow : 
app.post("/borrows", function(req, res) {
    var person_id = req.body.person_id;
    var sqlRequest = "SELECT * FROM Borrow WHERE Person_ID=$1";
    var values = [person_id];
    getSQLResult(req, res, sqlRequest, values);
});

app.post("/returnBook", function(req, res) {
    var borrow_id = req.body.borrow_id;
    var borrow_return = req.body.borrow_return;
    sqlRequest = "UPDATE Borrow SET"
        + " Borrow_Return=$1"
        + " WHERE Borrow_ID=$2"
        + " RETURNING Borrow_ID";
        values = [borrow_return, borrow_id];
    getSQLResult(req, res, sqlRequest, values);
});

app.post("/borrowBook", function(req, res) {
    var person_id = req.body.person_id;
    var book_id = req.body.book_id;
    var borrow_date = new Date().toISOString().slice(0, 10);
    var borrow_id = req.body.borrow_id;
    sqlRequest = "INSERT INTO Borrow(Borrow_ID, Person_ID, Book_ID, Borrow_Date)"
        + " VALUES ($1, $2, $3, $4)"
        + " RETURNING Borrow_ID";
    values = [borrow_id, person_id, book_id, borrow_date];
    sqlRequest2 = "SELECT * FROM Borrow WHERE Person_ID=$1";
    values2 = [person_id];
    getSQLResult2(req, res, sqlRequest, values, sqlRequest2, values2);
});

app.post("/bookTitle", function(req, res) {
    var book_id = req.body.book_id;
    var sqlRequest = "SELECT Book_Title FROM Book WHERE Book_ID=$1";
    var values = [book_id];
    getSQLResult(req, res, sqlRequest, values);
});

app.listen(8000, () => {
    console.log('Server started!')
});