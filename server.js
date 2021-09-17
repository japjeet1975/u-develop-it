const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.get('/',(req,res)=>{
// 	res.json({
// 		message: 'Hello World!'
// 	});
// });

// app.use((req,res)=>{
// 	res.status(404).end();
// });

//Connect to database
const db = mysql.createConnection(
	{
		host:'localhost',
		user:'root',
		password:'waheguru',
		database:'candidate'
	},
	console.log('Connected to election database ')
);
//to display all candidates 
// db.query(`SELECT * FROM candidates`, (err,rows)=>{
// console.log(rows);	
// });

//to display all candaiates in express.js //connecting to display the route
app.get('/api/candidates',(req,res)=>{
	const sql = `SELECT candidates.*, parties.name
	AS PARTY_NAME
	FROM candidates
	LEFT JOIN parties
	ON candidates.party_id = parties.id
	`;

	db.query(sql,(err,rows)=>{
		if (err){
			res.status(500).json({error:err.message});
			return;
		}
		res.json({
			message:'success',
			data: rows
		});
	});
});





//to display one candidate
// db.query(`SELECT * FROM candidates WHERE id=1`,(err,row)=>{
// 	if(err){
// 		console.log('err');
// 	}
// 	console.log(row);
// });

//to display single candidate via API endpoint

app.get('/api/candidate/:id', (req,res)=>{
const sql = `SELECT candidates.*, parties.name
AS party_name
FROM candidates
ON candidates.party_id = parties.id
WHERE candidates.id =?`;
const params = [req.params.id];

db.query(sql,params,(err,row)=>{
	if(err){
		res.status(400).json({error:err.message});
		return;
	}
	res.json({
		message:'success',
		data:row
	});
});

});



//to delete a candidate

// db.query(`DELETE FROM candidates WHERE id=?`,1,(err,result)=>{
// 	if(err){
// 		console.log('err');
// 	}
// 	console.log(result);
// })

//to delete a candidate via API route

app.delete('/api/candidate/:id', (req,res)=>{
	const sql = `DELETE FROM candidates WHERE id =?`;
	const params = [req.params.id];
	
	db.query(sql, params, (err, result) => {
		if (err) {
		  res.statusMessage(400).json({ error: res.message });
		} else if (!result.affectedRows) {
		  res.json({
		    message: 'Candidate not found'
		  });
		} else {
		  res.json({
		    message: 'deleted',
		    changes: result.affectedRows,
		    id: req.params.id
		});}
	});
	
	});

//create a caniddate via post

app.post('/api/candidate', ({body},res)=>{
	const errors = inputCheck(body, 'first_name','last_name','industry_connected');
	if (errors){
		res.status(400).json({error : errors});
	}
const sql = `INSERT INTO candidates(first_name,last_name, industry_connected)
VALUES (?,?,?)`;
 const params = [body.first_name, body.last_name, body.industry_connected];

 db.query(sql,params,(err,result)=>{
	 if(err){
		 res.status(400).json({error : err.message});
	 return;
		}
	res.json({
		message: 'success',
		data : body
	})
 })



}
);


//to create a candidate

// const sql = `INSERT INTO candidates(id,first_name,last_name, industry_connected)
// VALUES (?,?,?,?)`;
//  const params = [1,'Ronald','Firbank',1];

//  db.query(sql,params,(err,result)=>{
// 	 if(err){
// 		 console.log(err);
// 	 }
// 	 console.log(result);
//  })

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
      });