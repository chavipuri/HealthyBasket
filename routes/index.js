/* jshint node:true */

/*
 * GET home page.
 */

var sess;
// Load the bcrypt module
var bcrypt = require('bcrypt');
// Generate a salt
var salt = bcrypt.genSaltSync(10);
// Hash the password with the salt

exports.index = function(req, res){
  res.render('index');
};

exports.about = function(req, res){
  res.render('aboutus');
};

exports.contact = function(req, res){
  res.render('contact');
};


exports.search = function(ibmdb,connString) {
    return function(req, res) {
     
     var zipcode = req.body.zipcode;
	   	   
       ibmdb.open(connString, function(err, conn) {
			if (err ) {
			 res.send("error occurred " + err.message);
			}
			else {
				if (isNaN(zipcode)){
					
					conn.query("SELECT DISTINCT IMAGELINK, NAME, DESC2 FROM HOMEBASEDAPP.CATERER WHERE LOWER (CITY)= LOWER('" + zipcode +"');", function(err, tables, moreResultSets) {
							
							
				if ( !err ) { 
					res.render('search', {
						"tablelist" : tables, zipcode: zipcode						
					 });
					
				} else {
				   res.send("error occurred " + err.message);
				}

				/*
					Close the connection to the database
					param 1: The callback function to execute on completion of close function.
				*/
				conn.close(function(){
					console.log("Connection Closed");
					});
				});
				}
				else
				{
					conn.query("SELECT DISTINCT IMAGELINK, NAME, DESC2 FROM HOMEBASEDAPP.CATERER WHERE ZIPCODE= '" + zipcode +"';", function(err, tables, moreResultSets) {
							
							
				if ( !err ) { 
					res.render('search', {
						"tablelist" : tables, zipcode: zipcode						
					 });
					
				} else {
				   res.send("error occurred " + err.message);
				}

				/*
					Close the connection to the database
					param 1: The callback function to execute on completion of close function.
				*/
				conn.close(function(){
					console.log("Connection Closed");
					});
				});
				}
			}
		} );
	}
	}
	
	
		exports.menu = function(ibmdb,connString) {
    return function(req, res) {
    	
    var name = req.params.name;
    
     ibmdb.open(connString, function(err, conn) {
			if (err ) {
			 res.send("error occurred " + err.message);
			}
			else {
				
				conn.query("SELECT ITEM_NAME, PRICE FROM HOMEBASEDAPP.MENU WHERE CATERER_NAME='" + name + "';", function(err, tables, moreResultSets) {
					
							
				if ( !err ) {
					conn.query("SELECT DESC2 FROM HOMEBASEDAPP.CATERER WHERE NAME='" + name + "';", function(err, results, moreResultSet) {
						if ( !err ) { 
					    	res.render('menu', {"tablelist" : tables, "desc2" : results, name: name});
						} 
						else {
				   			res.send("error occurred " + err.message);
					 	}
					});
				}
				else {
				   res.send("error occurred " + err.message);
				}

				/*
					Close the connection to the database
					param 1: The callback function to execute on completion of close function.
				*/
				conn.close(function(){
					console.log("Connection Closed");
						});
				});

			}
		} );
	   
	}
	}
	
exports.checkout = function(req, res){
	//Chitra's
	sess=req.session;
	
	var caterer = req.body.caterer;
	sess.caterer = caterer;
	
	if(sess.username){
    res.render('checkout'
					,{
					 	 "username" : sess.username, "caterer": sess.caterer
					  });
	}
	else 
	{
	var message	 = "";   
	res.render('signin', {
						"message" : message
	});
	}
};

exports.finalpage = function(req, res){
  res.render('finalpage');
};

exports.insertpayment = function(ibmdb,connString) {
	/*sess=req.session;
	if(sess.simpleCart_finalTotal)
	{
		res.write(sess.simpleCart_finalTotal);
	}*/
    return function(req, res) {
    	var express = require('express');
		var app = express();
		var fname = req.body.fname;
		var lname = req.body.lname;
		var cardnumber1 = req.body.cc;
		var cardnumber = bcrypt.hashSync("cardnumber1", 10);	
		var expiry1 = req.body.expiry;
		var expiry = bcrypt.hashSync("expiry1", 10);
		var address1 = req.body.address1;
		var address2 = req.body.address2;
		var city = req.body.city;
		var state = req.body.state;
		var zip = req.body.zip;
		var finaltotal = req.body.fltAmount;
		var ordernum = ( Math.floor(Math.random() * (654321 - 123456) + 123456));
		sess=req.session; 
 		var email = sess.email;
 		var caterer = sess.caterer;
 		

       ibmdb.open(connString, function(err, conn) {

			if (err ) {
			 res.send("error occurred " + err.message);
			}
			else {
				conn.query("INSERT INTO HOMEBASEDAPP.PAYMENT2 (ORDERNUMBER, FNAME, LNAME, CARDNUMBER, EXPIRY,ADDRESS, ADDRESS2, CITY, STATE, ZIP, EMAIL, CATERERNAME, FINALTOTAL) VALUES ('" + ordernum +"','" + fname +"', '" + lname +"', '" + cardnumber +"', '" + expiry +"', '" + address1 +"', '" + address2 +"', '" + city +"', '" + state +"', '" + zip +"', '" + email +"', '" + caterer +"', '" + finaltotal +"');", function(err, tables, moreResultSets) 
				//conn.query("select FNAME FROM HOMEBASEDAPP.PAYMENT;" , function(err, tables, moreResultSets) 
				//conn.query("INSERT INTO HOMEBASEDAPP.PAYMENT VALUES ('"+ fname +"', '"+lname +"', "+cardnumber+", "+csv+", '"+expiry+"', '"+address1 +"', '"+address2+"', '"+city+"', '"+state +"', "+zip+", "+phone+");", function(err, tables, moreResultSets) 
				{		
				if ( !err ) {
					
					res.render('finalpage', {"tablelist" : tables, "ordernum": ordernum});				
//					res.send("Your order has been placed successfully. Your order number is: " + Math.floor(Math.random() * (654321 - 123456) + 123456));
					
				} else {
				   res.send("error occurred " + err.message);
				}
				//added this
				//res.send("Value is " +finaltotal + " Yes it is");
				conn.close(function(){
					console.log("Connection Closed");
					});
				});
			}
	} );
	   
	}
}
	
	
	//Chitra's
exports.signup = function(ibmdb,connString) {
    return function(req, res) {
	var message	 = "";   
	res.render('signup', {
						"message" : message
	});
	   
		}
	}

exports.signin = function(ibmdb,connString) {
    return function(req, res) {

	var message	 = "";   
	res.render('signin', {
						"message" : message
	});
	   
		}
	}
	exports.verify = function(ibmdb,connString) {
    return function (req,res) {
	var email = req.body.email;
	var password = req.body.password;
	     ibmdb.open(connString, function(err, conn) {
			if (err ) {
			 res.send("error occurred " + err.message);
			}
			else {
	//			conn.query("select USERNAME from HOMEBASEDAPP.LOGIN where EMAIL = '" + email +"' and PASSWORD = '" + password +"';", function(err, tables, loginResult) {
			conn.query("select USERNAME, PASSWORD from HOMEBASEDAPP.LOGIN where EMAIL = '" + email +"' ;", function(err, tables, loginResult) {											
				if ( !err ) {
					if(tables.length > 0){
 					var username = tables[0].USERNAME;
 					sess=req.session;  
 					sess.username = username;
 					sess.email = email;
 					var hash = tables[0].PASSWORD;
 					if (bcrypt.compareSync("password", hash))
					{
					res.render('checkout'
					,{
					 	 "username" : username, "caterer": sess.caterer
					  });
 					} else {
					message = "Either Username or Password incorrect";
					res.render('signin', {
						"message" : message
						 });}}
				  } else {
				   res.send("error occurred " + err.message);
				}
				/*
					Close the connection to the database
					param 1: The callback function to execute on completion of close function.
				*/
				conn.close(function(){
					console.log("Connection Closed");
					});
				});
			}
		} );
	   
	}
	}
	
	exports.insert = function(ibmdb,connString) {
    return function(req, res) {
		var username = req.body.username;
		var email = req.body.email;
		var password = req.body.password;
		var phone = req.body.phone;
	   	var hash = bcrypt.hashSync("password", 10);
       
       ibmdb.open(connString, function(err, conn) {
			if (err ) {
			 res.send("error occurred " + err.message);
			}
			else {
				conn.query("insert into HOMEBASEDAPP.LOGIN (USERNAME, EMAIL, PASSWORD, PHONE) values('" + username +"',  '" + email +"', '" + hash +"', '" + phone +"');", function(err, tables, moreResultSets) {
							
							
				if ( !err ) {
				
					var message	 = "Signup Successful. Please Signin";   
					res.render('signin', {
						"message" : message
					});
				} else {
				   res.send("error occurred " + err.message);
				}

				/*
					Close the connection to the database
					param 1: The callback function to execute on completion of close function.
				*/
				conn.close(function(){
					console.log("Connection Closed");
					});
				});
			}
		} );
	   
	}
	}
//Chitra's
