var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'sql11.freemysqlhosting.net',
  user: 'sql11154229',
  password: 'UjFU1sJ8ke',
  database: 'sql11154229'
});
var passwordHash = require('password-hash');
var moment = require('moment');

connection.connect(function(err){
	if(!err) {
		console.log("Database is connected");
	}
	else {
		console.log("Error connecting database");
	}
});

exports.index = function(req, res) {
	res.render('default', {
		title: 'Home',
	});
};

exports.home = function(req, res) {
	connection.query('SELECT * FROM wahis ORDER BY timestamp DESC', function(err, rows, fields) {
		if (err) {
			   res.send({ err });
		}
		else {
			res.render('home', {
				'rows' : rows,
        moment: moment,
				title: 'Meine Wahi Kakas',
				message: req.flash('messageDelete'),
        message: req.flash('messageLogin')
			});
		}
		
	});
};

exports.show = function(req, res){
    
  var id = req.params.id;

  connection.query('SELECT * FROM wahis WHERE id = ?',[id],function(err,rows)
    {
            
    if(err) {
		   res.send({ err });
	}
	else {
		res.render('home_show',{
			rows : rows,
			title: " Detailübersicht "
		});
    }
                           
    });
};

exports.delete = function(req, res){
    
  var id = req.params.id;
    
 // req.getConnection(function (err, connection) {
    
    connection.query("DELETE FROM wahis WHERE id = ? ",[id], function(err, rows)
    {
        
        if(err) {
             console.log("Error deleting : %s ",err );
        }
        else {
        	req.flash('messageDelete', 'Wahikaka erflogreich gelöscht');
         	res.redirect('/home');
     	}
         
    });
};


// =====================================
// LOGIN ===============================
// =====================================
// show the login form
exports.login = function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login', {message: req.flash('loginMessage'),
		        title: "Login",
            message: req.flash('messageRegister')
    });
};

exports.login.send = function(req, res) {
  var input = JSON.parse(JSON.stringify(req.body));
  var data = {
    email : input.email,
    password : passwordHash.generate(input.password)
    };
  // res.send(data);

    connection.query('SELECT * FROM users WHERE email = ?', data.email, function(err, rows, fields){
    if (err) console.log("Error inserting : %s ",err );
          req.flash('messageLogin', 'Du bist nun eingeloggt, '+ rows[0].name +'. Viel Spaß mit deinen Wahi Kakas.');
          res.redirect('/home');

    });
};

// =====================================
// REGISTER ============================
// =====================================
// show the login form
exports.register = function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('register', {message: req.flash('registerMessage'),
		title: "register",
    });
};

exports.register.send = function(req, res) {
	var input = JSON.parse(JSON.stringify(req.body));
    var data = {
		name	: input.name,
		email : input.email,
		password : passwordHash.generate(input.password)
    };

    connection.query('INSERT INTO users SET ?', data, function(err, rows, fields){
	   if (err) console.log("Error inserting : %s ",err );
		res.render('login', {
			message: 'Vielen Dank für Deine Registierung, '+ data.name +'. Du kannst Dich nun einloggen.',
			title: "Login",
   		});
	});
};

// REST-API
// =====================================
// GET ===============================
// =====================================
exports.wahis = function(req, res) {
	connection.query('SELECT * FROM wahis', function(err, rows, fields) {
		if (err) {
			   res.send({ err });
		}
		else {
			res.send({ result:rows });
		}
		
	});
};

// =====================================
// ADD ===============================
// =====================================
exports.wahis.add = function(req, res) {
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;

    var data = {
        
        steps : input.steps,
        fromCity : input.fromCity,
        toCity : input.toCity,
        toCountry : input.toCountry,
        direction  : input.direction,
        image  : input.image,
        latFrom  : input.latFrom,
        latTo   : input.latTo,
        lonFrom : input.lonFrom,
        lonTo : input.lonTo,
        infoText  : input.infoText,
        userid: input.userid, 
        timestamp: input.timestamp

    };
    
    connection.query('INSERT INTO wahis set ?', data, function(err, rows)
    {

      if (err) {

          res.send({status: 1, message: 'Wahikaka creation failed' + err});
        } else {
          res.send({status: 0, message: 'Wahikaka created successfully'});
        }
      
    });
};

// =====================================
// GET Single Wahi =====================
// =====================================
exports.wahis.show = function(req, res) {
	var id = req.params.id;
	
	connection.query('SELECT * FROM wahis WHERE id = ?',[id],function(err,rows)
    {
            
    if(err) {
		   res.send({ err });
	}
	else {
		res.send({ result:rows });
    }
                           
    });
};

// =====================================
// GET Single Wahi =====================
// =====================================
exports.wahis.showUserWahis = function(req, res) {
  var email = req.params.email;
  
  connection.query('SELECT * FROM wahis WHERE userid = ?',[email],function(err,rows)
    {
            
    if(err) {
      res.send({ err });
  }
  else {
    res.send({ result:rows });
    }
                           
    });
};



// =====================================
// UPDATE Single Wahi ==================
// =====================================
exports.wahis.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;

    var data = {
        
        steps : input.steps,
        fromCity : input.fromCity,
        toCity : input.toCity,
        toCountry : input.toCountry,
        direction  : input.direction,
        image  : input.image,
        latFrom  : input.latFrom,
        latTo   : input.latTo,
        lonFrom : input.lonFrom,
        lonTo : input.lonTo,
        infoText  : input.infoText    
    };
    
    connection.query("UPDATE wahis set ? WHERE id = ? ",[data,id], function(err, rows)
    {

      if (err)
          console.log("Error Updating : %s ",err );
     
      res.redirect('/wahis');
      
    });
};

// =====================================
// DELETE Single Wahi ==================
// =====================================
exports.wahis.delete = function(req,res){
          
    var id = req.params.id;
    connection.query("DELETE FROM wahis WHERE id = ? ",[id], function(err, rows)
    {
        
         if(err)
             console.log("Error deleting : %s ",err );
        
         res.send(id);
         
    });
};

// =====================================
// GET Users ==================
// =====================================
exports.users = function(req, res) {
  connection.query('SELECT * FROM users', function(err, rows, fields) {
    if (err) {
         res.send({ err });
    }
    else {
      res.send({ result:rows });
    }
    
  });
};


// =====================================
// GET Single User =====================
// =====================================
exports.users.show = function(req, res) {
  var email = req.params.email;
  
  connection.query('SELECT * FROM users WHERE email = ?',[email],function(err,rows)
    {
            
    if(err) {
       res.send({ err });
  }
  else {
    res.send({ result:rows });
    }
                           
    });
};


// =====================================
// POST User ===============================
// =====================================
exports.users.add = function(req, res) {
    var input = JSON.parse(JSON.stringify(req.body));

    var data = {

        password: input.password,
        email: input.email

    };
    
    connection.query('INSERT INTO users set ?', data, function(err, rows)
    {

      if (err) {

          res.send({status: 1, message: 'Wahikaka creation failed' + err});
        } else {
          res.send({status: 0, message: 'Wahikaka created successfully'});
        }
      
    });
};

// =====================================
// GET Wahi steps ==================
// =====================================
exports.wahisteps = function(req, res) {
  connection.query('SELECT * FROM wahisteptable', function(err, rows, fields) {
    if (err) {
         res.send({ err });
    }
    else {
      res.send({ result:rows });
    }
    
  });
};

// =====================================
// GET sum of wahi steps ==================
// =====================================
exports.wahisteps.sum = function(req, res) {

  var input = JSON.parse(JSON.stringify(req.body));

  var email = input.mail;
  var fromDate = input.fromDate;
  var toDate = input.toDate;


  // $sqlquery="SELECT SUM(steps) FROM wahisteptable WHERE userid='".$mail."' AND dateCol between '".$from."' AND '".$to."';";
  connection.query('SELECT SUM(steps) FROM wahisteptable WHERE userid=? AND dateCol between ? and ?',[email, fromDate, toDate], function(err, rows, fields) {
    if (err) {
         res.send({ err });
    }
    else {
      res.send({ result:rows[0]["SUM(steps)"] });
    }
    
  });
};


// =====================================
// POST wahi steps ===============================
// =====================================
exports.wahisteps.add = function(req, res) {
    var input = JSON.parse(JSON.stringify(req.body));

    var userid= input.mail;
    var dateCol = input.date;
    var steps = input.steps;


    var data = {

        userid: userid,
        dateCol: dateCol,
        steps: steps

    };
    
    connection.query('INSERT INTO wahisteptable set ?', data, function(err, rows)
    {

      if (err) {

          //res.send({status: 1, message: 'Wahikaka insert failed' + err});
          connection.query('UPDATE wahisteptable SET steps=? WHERE userid=? AND dateCol=?', [steps, userid, dateCol], function(err, rows){

            if(err){
                 res.send({ err });
            }else {
              res.send({status: 0, message: 'Wahisteps updated successfully ' + dateCol});
            }
          });
        } else {
          res.send({status: 0, message: 'Wahisteps added successfully'});
        }
      
    });
};


// =====================================
// GET stepbackup ==================
// =====================================
exports.stepsbackup = function(req, res) {
  connection.query('SELECT * FROM stepzwischenstand', function(err, rows, fields) {
    if (err) {
       res.send({ err });
    }
    else {
      res.send({ result:rows });
    }
    
  });
};


// =====================================
// POST stepbackup steps ===============================
// =====================================
exports.stepsbackup.add = function(req, res) {
    var input = JSON.parse(JSON.stringify(req.body));

    var data = {

        userid: input.mail,
        datum: input.date,
        steps: input.steps

    };
    
    connection.query('INSERT INTO stepzwischenstand set ?', data, function(err, rows)
    {

      if (err) {
          res.send({status: 0, message: 'Stepbackups added failed'});
        } else {
          res.send({status: 0, message: 'Stepbackup added successfully'});
        }
      
    });
};


// =====================================
// POST stepbackup User =====================
// =====================================
exports.stepsbackup.userDate = function(req, res) {
    var input = JSON.parse(JSON.stringify(req.body));
    var email = input.mail;
    var date = input.date;


  connection.query('SELECT * FROM stepzwischenstand WHERE userid = ? AND datum = ? ',[email, date],function(err,rows)
    {
            
    if(err) {
       res.send({ err });
  }
  else {
    res.send({ result:rows });
    }
                           
    });
};

