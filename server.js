var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var urls = require('url');
var exec = require('child_process').exec;

//User Settings
var username="markbreneman";
var boardname="behavior-change";
var filePrefix="behavior-change";
var fileIndex=1;
var dlDir = './'+boardname+'/';
var imageLargeURL;
var url = 'https://www.pinterest.com';

//Specific to Pintrest CMS 02.25.15
var pinterestAnchor= '.pinHolder a';
var pinterestIMG= '.pinImage';


app.get('/downloadPinterest', function(req, res){

	userBoardURL = url+'/'+username+'/'+boardname;
	// console.log(url);

	//INITIAL PAGE REQUEST FOR THE USERS BOARD
	request(userBoardURL, function(error, response, body){
		if (error) throw error;

		if(!error){
			var $ = cheerio.load(body);
			$(pinterestAnchor).each(function(){
				var imageLargeURL= $(this).attr('href');
				console.log(url+imageLargeURL);

				//PAGE REQUEST FOR THE SPECIFIC PICTURE ON THE BOARD
				request(url+imageLargeURL,function(err,resp,body){
				//redirects to larger image page
					var $ = cheerio.load(body);
					var fileURL = $(pinterestIMG).attr('src');
					var fileExt = fileURL.substr(fileURL.length - 3)


					var fileName = filePrefix + "_"+ fileIndex +"."+ fileExt;
	        //in curl we have to escape '&' from fileUrl
	        var curl =  'curl ' + fileURL.replace(/&/g,'\\&') +' -o ' + dlDir+fileName + ' --create-dirs';
	        var child = exec(curl, function(err, stdout, stderr) {
	            if (err){ console.log(stderr); throw err; }
	            else console.log(fileName + ' downloaded to ' + dlDir);
	        });
					fileIndex+=1;
			});//Finish Request
  	});//Finish For Loop
	}//Finish IF Statement

	res.send('Finished');
}); //Finish Request
});

app.listen('8081');
console.log('Go to 8081');
exports = module.exports = app;
