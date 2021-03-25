let mysql = require("mysql");
const http = require('http');
var fs = require('fs');

console.log('starting...')
http.createServer(async function(req, res) {
/*
    let con = mysql.createConnection({
        host: "majdalhayek.com",
        user: "majdalha_fadinodemysql",
        password: "Pal142857",
        database: "majdalha_fadiproject"
        //debug: false
    });
*/
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "fadiproject"
    //debug: false
});
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*"
    });
    /*
    if (req.method == 'POST') {

        //console.log('POST request...');
        let body = '';
        req.on('data', function(data) {

            //console.log('onData', data.toString())
            body += data.toString();
            if (body.length > 10000000) {
                http.request.connection.destroy();
            }
        });

        req.on('end', () => {
            let worked = false;

            if (body) {
                let data = JSON.parse(body);  
                console.log('POST data received...', data);
  
                  connect(con)
                    .then(() => {

                        data.forEach(function(item) {
                            addQuestion(con, item.title)
                                .then(function(result){
            
                                    addOptions(con, result.insertId, item.options)
                                        .then(function(data){
                                            res.end(JSON.stringify({
                                                worked: worked,
                                                question_id: result.insertId,
                                            }));
                                        }).catch((error) => {
                                            console.log('failed to add options');
                                            console.log(error);
                                        });
                                }).catch((error) => {
                                    console.log('failed to add question');
                                    console.log(error);
                                });
                            }).catch((err) => {
                                console.log('failed along the lines.');
                                console.log(err);
                            });
                    }).then(() => {
                        //end(con);
                    }).catch((err) => {
                        console.log('failed to connect');
                        console.log(err);
                    });                
            }
        });
    } else */
    if (req.method == 'PUT') {

        //console.log('POST request...');
        let body = '';
        req.on('data', function(data) {

            //console.log('onData', data.toString())
            body += data.toString();
            if (body.length > 10000000) {
                http.request.connection.destroy();
            }
        });

        req.on('end',  () => {
            let worked = false;

            if (body) {
                let questions = JSON.parse(body);  
                console.log('PUT data received...');
                let worked = true;

                connect(con)
                  .then(() => {

                     updateAllQuestion(con, questions).then(()=>{
                        console.log('safe to close');
                    });
                }).then( () => {
                    console.log('Responding!!!');
                    //end(con);
                    res.end(JSON.stringify({
                        worked: worked
                    }));

                }).catch((err) => {
                    console.log('failed to connect');
                    console.log(err);
                });                
            }
        });
    } else if(req.method == 'DELETE') {

        let parts = req.url.split('/'); 

        if (parts.length > 1) {

            connect(con).then(() => {

                deleteRecord(con, parts[1]).then((deleteResult) => {

                    res.end(JSON.stringify({
                        worked: deleteResult.affectedRows == 1
                    }));
                });
            }).then(() =>{
                end(con);
            });
        }
        

    } else {
        // GET 

        connect(con).then(() => {
            getRecords(con).then((result) => {

                let response = {};

                 result.forEach(function(item){
                
                    if(!(item.question_id in response)) {
                        response[item.question_id] = {
                            title: item.question_title, 
                            question_id: item.question_id,
                            options:[]
                        };
                    }

                    response[item.question_id].options.push({ 
                        option: item.option_title,
                        is_correct: item.is_correct,
                        question_id: item.question_id,
                        option_id: item.option_id
                    });
                });
                
                res.end(JSON.stringify({
                    worked: true,
                    records: response
                }));
            });
           
        }).then(() => {
            end(con);
        });
    }

}).listen(8888);


function updateAllQuestion(con, questions)
{
    return new Promise((resolve, reject) => {
        try {
            questions.forEach((question) => {
                updateQuestionAndOptions(con, question).then(() => {
                    console.log('Finished updating question...');
                });
            }); // ends foreach

            return resolve();
        } catch (error) {
            return reject(error);
        } 
    })

}

function updateQuestionAndOptions(con, question)
{
    return new Promise((resolve, reject) => {


        updateQuestion(con, question.title, question.question_id)
        .then(async (result) => {
            // At this point we either updated or inserted a new question
            // next, update the options

            for(let x = 0 ; x < question.options.length; x++){
                let option = question.options[x];

                // manually set the question_id to either the existing
                // question_id or the newly generated id
                option.question_id = question.question_id || result.insertId;
                
                await updateOptions(con, option).then(()=>{
                    console.log('Option updated!');
                });
            }
            return resolve(result);
        }).catch((error) => {
            worked = false;
            console.log('failed to add question');
            console.log(error);

            return reject(error);
        });
    });
    
}
function connect(con) {

    return new Promise((resolve, reject) => {
        con.connect((err) => {

            if(err) return reject(err);

            return resolve();
        })
    });
}

function end(con) {

    return new Promise((resolve, reject) => {
        con.end((err)=> {

            if(err) return reject(err);

            return resolve();
        })
    });
}

function deleteRecord(con, question_id) {

    return new Promise((resolve, reject) => {

        let sql = " DELETE FROM _questions WHERE Id = ? ";

        con.query(sql, [question_id], function(err, result) {
            if (err) reject(err);

            return resolve(result);
        });
    });
}

function getRecords(con) {

    return new Promise((resolve, reject) => {

        let sql = " SELECT q.id AS question_id, q.title AS question_title, o.title AS option_title, CASE WHEN o.is_correct = 1 THEN true ELSE false END AS is_correct, o.id AS option_id " +
                  " FROM _questions AS q " +
                  " INNER JOIN _options AS o ON o.question_id = q.id ";

        con.query(sql, function(err, result) {
            if (err) reject(err);

            return resolve(result);
        });
    });
}

function addQuestion(con, title) {
    return new Promise((resolve, reject) => {

        let sql = "INSERT INTO _questions SET ?";

        con.query(sql, {title: title}, function(err, result, fields) {
            if (err) return reject(err);
            return resolve(result);
            
        });
        //con.end();
    });
}


function updateQuestion(con, title, id) {
    return new Promise((resolve, reject) => {

        let sql = " INSERT INTO _questions (title, id) VALUES (?, ?)  " + 
                  " ON DUPLICATE KEY UPDATE " + 
                  " title = ?, id = ?;";

        con.query(sql, [title, id, title, id], function(err, result) {
            if (err) return reject(err);

            return resolve(result);
        });
        //con.end();
    });
}

function addOptions(con, questionId, options) {

    return new Promise((resolve, reject) => {
        let values = [];

        for(let x = 0 ; x < options.length; x++){
            let option = options[x];

            values.push([
                option.text, 
                option.isCorrect, 
                questionId
            ]);
        }

        let sql = "INSERT INTO _options (title, is_correct, question_id) VALUES ?";
        con.query(sql, [values], function(err, result) {
            if (err) return reject(err);

            return resolve(result);
        });
        //con.end();

    });
}

function updateOptions(con, option) {

    return new Promise((resolve, reject) => {

        let sql = " INSERT INTO _options (title, is_correct, question_id, id) " +
                  " VALUES (?, ?, ?, ?) " +
                  " ON DUPLICATE KEY UPDATE " +
                  " title = ?, is_correct = ?, question_id = ?, id = ?;";

        con.query(sql, [option.text, option.isCorrect, option.question_id, option.option_id, option.text, option.isCorrect, option.question_id, option.option_id], function(err, result) {
            if (err) return reject(err);

            return resolve(result);
        });
    });
}