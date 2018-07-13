// import module
var express = require('express'); 
var app = express(); 

app.get('/', function (req, res) {
  res.send('Hello World!');
});
 
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
 
  console.log('앱은 http://%s:%s 에서 작동 중입니다.', host, port);
});
 
/*
// connect database
mongoose.connect("mongodb://test:1234@127.0.0.1:27017/mydb");
var db = mongoose.connection;
db.once("open",function(){
	console.log("db connected");
});
db.on("error",function(err){
	console.log("db error : ", err);
});

// model setting
var postSchema =  mongoose.Schema({
	title:{type:String,required:true},
	body:{type:String, required:true},
	createdAt: {type:Date, default:Date.now},
	updatedAt: {type:Date}
});
var Post =  mongoose.model('post',postSchema);

var userSchema = mongoose.Schema({
	email:{type:String, required:true, unique:true},
	nickname:{type:String, required:true, unique:true},
	password:{type:String, required:true},
	createdAt: {type:Date, default:Date.now}
});
var User = mongoose.model('user',userSchema);


// view setting
//app.set('views', __dirname + '/views'); 
app.set('view engine','ejs'); 
//app.engine('html', require('ejs').renderFile);
 
// set middlewares
app.use(express.static(path.join(__dirname,'/public')));
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({extended:true})); 
app.use(methodOverride("_method"));
app.use(flash());

app.use(session({secret:'MySecret',resave:false,saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user,done){
	done(null,user.id);
});

passport.deserializeUser(function(id,done){
	User.findById(id,function(err,user){
		done(err,user);
	});
});

var LocalStrategy = require('passport-local').Strategy;
passport.use('local-login',
	new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req,email,password,done){
		User.findOne({'email':email},function(err,user){
			if(err) return done(err);
			if(!user){
				req.flash('email',req.body.email);
				return done(null,false,req.flash('loginError','No user found'));
			}
			if(user.password != password){
				req.flash('email',req.body.email);
				return done(null,false,req.flash('loginError','password dose not match'));

			}
			return done(null,user);
		});
	}
	)
);
 
// set routes
app.get('/',function(req,res){
	res.redirect('/posts');
});

app.get('/login',function(req,res){ 
	res.render('login/login',{email:req.flash('email')[0],loginError:req.flash('loginError')});
});
 
app.post('/login',function(req,res,next){
	req.flash('email');
	if(req.body.email.length === 0 || req.body.password.length === 0){
		req.flash('email',req.body.email);
		req.flash('loginError','please enter both email and password');
		res.redirect('/login');
	}else{
		next();
	}
},
	passport.authenticate('local-login',{
		successRedirect : '/posts',
		failureRedirect : 'login',
		failureFlash : true
	})
);

app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
}); 

app.get('/posts',function(req,res){	
	Post.find({}).sort('-createdAt').exec(function(err,posts){
		if(err) return res.json({success:false,message:err});
		res.render("posts/index",{data:posts});
	});
}); // index

app.get('/posts/new',function(req,res){
	res.render("posts/new");
}); //new

app.post('/posts',function(req,res){ 
	Post.create(req.body.post,function(err,post){
		if(err) return res.json({success:false,message:err}); 
		
		res.redirect('/posts');
	});
}); //create

app.get('/posts/:id',function(req,res){ 	
	Post.findById(req.params.id,function(err,post){
		if(err) return res.json({success:false,message:err}); 
		
		res.render("posts/show",{data:post});
	});
}); //show

app.get('/posts/:id/edit',function(req,res){ 	
	Post.findById(req.params.id,function(err,post){
		if(err) return res.json({success:false,message:err}); 
		
		res.render("posts/edit",{data:post});
	});
}); //edit

app.put('/posts/:id',function(req,res){ 
	req.body.post.updatedAt=Date.now();
	Post.findByIdAndUpdate(req.params.id,req.body.post,function(err,post){
		if(err) return res.json({success:false,message:err}); 
		
		res.redirect('/posts/'+req.params.id);
	});
}); //update

app.delete('/posts/:id',function(req,res){  
	Post.findByIdAndRemove(req.params.id,function(err,post){
		if(err) return res.json({success:false,message:err}); 
		
		res.redirect('/posts');
	});
}); //destory
   
// start server
app.listen(3000,function(){
	console.log('server start...');
});
*/
 