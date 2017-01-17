var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'sql11.freemysqlhosting.net',
  user: 'sql11154229',
  password: 'UjFU1sJ8ke',
  database: 'sql11154229'
});
var passwordHash = require('password-hash');

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
	connection.query('SELECT * FROM wahis ORDER BY steps DESC', function(err, rows, fields) {
		if (err) {
			throw err;
		}
		else {
			res.render('home', {
				'rows' : rows,
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
		throw err;
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
      console.log(rows);
          req.flash('messageLogin', 'Du bist nun eingeloggt: '+ rows[0].name +'. Viel Spaß mit deinen Wahi Kakas.');
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
			throw err;
		}
		else {
			res.send({ result:rows });
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
		throw err;
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
  var id = req.params.id;
  
  connection.query('SELECT * FROM wahis WHERE userid = ?',[id],function(err,rows)
    {
            
    if(err) {
    throw err;
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
        
        steps	: input.steps,
        fromCity : input.fromCity,
        toCity : input.toCity,
        toCountry : input.toCountry,
        direction  : input.direction,
        latFrom  : input.latFrom,
        latTo   : input.latTo,
        lonFrom : input.lonFrom,
        lonTo : input.lonTo
    
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