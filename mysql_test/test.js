const qs = require("querystring");
// 统一处理contentType为text/html时的响应头
exports.sendHtml = (res, html) => {
    res.setHeader('content-type','text/html; charset=UTF-8');
    res.setHeader("Content-Length", Buffer.byteLength(html));
    res.end(html);
}
// 统一解析接收到的url字符串
exports.parseReceivedData = (req, cb) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunck)=>{
        body+=chunck
    });
    req.on("end", ()=>{
        let data = qs.parse(body);
        cb(data);
    })
}
// 模拟post提交的表单
exports.actionForm = (id, path, label) => {
    let html = `<form method = "post" action=${path}><input type="hidden" name="id" value=${id} /><input type="submit" value=${label} /></form>`
    return html;
}
// 数据的增、删、改、查
exports.add = (db, req, res) => {
    exports.parseReceivedData(req, (work) => {
        db.query("INSERT INTO test (title,author,date) VALUES (?,?,?)", [work.title, work.author, work.date], (err) => {
            if (err) throw err;
            exports.find(db, res);
        })
    })
}
exports.delete = (db, req, res) => {
    exports.parseReceivedData(req, (work) => {
        db.query("DELETE FROM test WHERE id=?", [work.id], (err) => {
            if (err) throw err;
            exports.find(db, res);
        })
    })
}
exports.update = (db, req, res) => {
    exports.parseReceivedData(req, (work) => {
        db.query("UPDATE test SET update=1 WHERE id=?", [work.id], (err) => {
            if (err) throw err;
            exports.find(db, res);
        })
    })
}
exports.find = (db, res) => {
    db.query("SELECT * FROM test", (err, rows) => {
        if (err) throw err;
        exports.sendHtml(res, exports.testListHtml(rows)+exports.testFormHtml());
    })
}
// 在前端页面展示数据库表
exports.testListHtml = (rows)=>{
    let html = "<table border>";
    for (let i in rows) {
        html+="<tr>";
        html+="<td>"+rows[i].id+"</td>";
        html+="<td>"+rows[i].title+"</td>";
        html+="<td>"+rows[i].author+"</td>";
        html+="<td>"+rows[i].date+"</td>";
        if(rows[i].update){
            html+="<td>"+rows[i].update+"</td>";
        }
        html+="</tr>";
    }
    html+="<table>";
    return html;
}
// 在前端页面展示新增数据的表单
exports.testFormHtml = ()=>{
    let html = `<form method="post" action="/"><p><input type="text" name="title" value="标题"/></p><input type="text" name="author" value="作者"/></p><input type="date" name="date" value="日期"/></p><p><input type="submit" value="add" /></p></form>`;
    return html;
}