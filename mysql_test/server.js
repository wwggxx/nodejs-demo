const http = require("http");
const mysql = require("mysql");
const test = require('./test.js');
const options = {
    host: "127.0.0.1",
    port: "3001"
}
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "mysql"
})
const server = http.createServer((req, res)=>{
    switch (req.method) {
        case "GET":
            switch (req.url) {
                case "/":
                    test.find(db, res);
                    break;
            }
            break;
        case "POST":
            switch (req.url) {
                case "/":
                    test.add(db, req, res);
                    break;
            }
        break;
    }
})
db.query(
    `CREATE TABLE IF NOT EXISTS test(
        id INT UNSIGNED AUTO_INCREMENT,
        title VARCHAR(100) NOT NULL,
        author VARCHAR(40) NOT NULL,
        date DATE,
        PRIMARY KEY (id)
    )`,(err)=>{
        if (err) throw  err;
        console.log("server started...");
        server.listen(options.port, options.host)
    }
)