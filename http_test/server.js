const http = require("http");
const qs = require("querystring");
const options = {
    port: 4000,
    hostname: '127.0.0.1'
}
let items = ['list1', 'list2', 'list3'];
// 请求成功，状态码200
const show = (res) => {
    let html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Document</title></head><body><h1>Todo List</h1><ul>${items.map((item) => {
        return `<li>${item}</li>`
    }).join("")}</ul><form method="post" action="/"><p><input type="text" name="item"></p><p><input type="submit" value="add Item"></p></form></body></html>`
    // text/html 返回来数据的是html格式  text/plain 返回来的数据是普通文本格式
    res.setHeader("Content-Type","text/html");
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}
// 找不到资源错误，状态码404错误
const notFound = (res) => {
    res.statusCode = 404;
    res.setHeader('Content-Length', 'text/plain');
    res.end("no found");
}
// 请求失败错误，状态码400错误
const badRequest = (res) => {
    res.statusCode = 400;
    res.setHeader('Content-Length', 'text/plain');
    res.end("bad request");
}
// post请求
const add = (req, res) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data",(chunk)=>{body+=chunk;});
    req.on("end",()=>{
        let obj = qs.parse(body);
        items.push(obj.item);
        show(res);
    })
}
// 创建http请求实例
let server = http.createServer((req, res)=>{
    if("/" == req.url){
        switch (req.method){
            case "GET":
                show(res);
                break;
            case "POST":
                add(req,res);
                break;
            default:
                badRequest(res);
        }

    }
}).listen(options.port, options.hostname, ()=>{
    console.log(`目前您访问的是${options.hostname}主机，端口号是${options.port}`)
})

