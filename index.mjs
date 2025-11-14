import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "sh4ob67ph9l80v61.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "w9c7lwn8um1o99yj",
    password: "u3rw8lbcasz2h307",
    database: "pyn5h5u7iu857dd2",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', (req, res) => {
   res.render('home.ejs')
});

app.get('/quotes', async(req, res) => {
   let sql = `SELECT quoteId, quote
              FROM quotes`;
   const [quotes] = await pool.query(sql);                     
   res.render('quotes.ejs', {quotes})
});

//displays form to update the quote selected
app.get('/updateQuote', async(req, res) => {
    let quoteId = req.query.quoteId;
    let sql = `SELECT *
               FROM quotes
               WHERE quoteId = ?`;
    const [quoteInfo] = await pool.query(sql, [quoteId]);         
    res.render('updateQuote.ejs', {quoteInfo})
});

//displays form to update a specific author
app.get('/updateAuthor', async(req, res) => {
   let authorId = req.query.id;
   let sql = `SELECT *,
              DATE_FORMAT(dob,'%Y-%m-%d') ISOdob,
              DATE_FORMAT(dod,'%Y-%m-%d') ISOdod
              FROM authors
              WHERE authorId = ?`;
   const [authorInfo] = await pool.query(sql, [authorId]);          
   res.render('updateAuthor.ejs', {authorInfo});
});

app.post('/updateAuthor', async(req, res) => {
    let authorId = req.body.authorId;
    let fName = req.body.fn;
    let lName = req.body.ln;
    let sql = `UPDATE authors
               SET firstName = ?,
                   lastName = ?
               WHERE authorId = ?`
    let sqlParams = [fName, lName, authorId];
    const [row] = await pool.query(sql, sqlParams);  
    res.redirect('/authors'); //displays the list of authors
});




app.get('/authors', async(req, res) => {
   let sql = `SELECT authorId, firstName, lastName
              FROM authors
              ORDER BY lastName`;
    const [authors] = await pool.query(sql);           
    res.render('authors.ejs', {authors})
});


//Displays form to add a new quote
app.get('/addQuote', (req, res) => {
   //get list of authors and pass it
   //get list of categories and pass it
   res.render('addQuote.ejs', {authors, categories})
});


app.post('/addQuote', (req, res) => {

   let quote = req.body.quote;

   //add quote to the database

   //get list of authors and pass it
   //get list of categories and pass it
   res.render('addQuote.ejs', {authors, categories})
});

//Displays form to add a new author
app.get('/addAuthor', (req, res) => {
   res.render('addAuthor.ejs')
});

//Stores author data into the database
app.post('/addAuthor', async (req, res) => {
    let firstName = req.body.fn;
    let lastName = req.body.ln;
    let sql = `INSERT INTO authors
                (firstName, lastName)
                VALUES (?, ?)`;
    let sqlParams = [firstName, lastName];  
    const [rows] = await pool.query(sql, sqlParams);       
    res.render('addAuthor.ejs')
});

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})

