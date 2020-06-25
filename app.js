const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose')
const _ = require("lodash")

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine' , 'ejs');

mongoose.connect("mongodb://localhost:27017/nbaDB",{useNewUrlParser : true,useUnifiedTopology: true});

const nbaSchema = {
	playerName: String,
	teamName:String,
	rank:Number
}

const Player = mongoose.model("player" ,  nbaSchema);

////////////////////////////////////////////////////routing for overall posts////////////////////////////////////////////////////

app.route("/nbatopten")

.get(function(req,res){
	Player.find({} , function(err,response){
		if (!err) {
			res.send(response)
		}
		else{
			res.send(err)
		}
	})
})

.post(function(req,res){
	const newPlayer = new Player({
		playerName:req.body.playerName,
		teamName:req.body.teamName,
		rank:req.body.rank
	})
	newPlayer.save(function(err){
		if(!err){
			res.send("successfully added")
		}
		else{
			res.send(err)
		}
	})
})

.delete(function(req,res){
	Player.deleteMany(function(err){
		if (!err) {
			res.send("Deleted successfully")
		}
	})
})


////////////////////////////////////////////////////routing for specific posts////////////////////////////////////////////////////

app.route("/nbatopten/:playerrank")

.get(function(req,res){
	Player.findOne({rank:req.params.playerrank},function(err,response){
		if(!err){
			res.send(response)
		}
		else{
			res.send(err)
		}
	})
})

.put(function(req,res){
	Player.update({rank:req.params.playerrank},
		{playerName:req.body.playerName,teamName:req.body.teamName,rank:req.body.rank},
		{overwrite:true},function(err){
			if (!err) {
				res.send("successfully updated")
			}
			else{
				res.send(err)
			}
		}
		)
})

.patch(function(req,res){
	Player.updateOne(
		{rank:req.params.playerrank},
		{$set:req.body},
		function(err){
		if (!err) {
			res.send("successfully patched")
		}
		else{
			res.send(err)
		}
	})

})

.delete(function(req,res){
	Player.deleteOne({rank:req.params.playerrank},function(err){
		if(!err){
			res.send("successfully deleted")
		}
		else{
			res.send(err)
		}
	})
})



app.listen(3000,function(){
	console.log("server started successfully")
})