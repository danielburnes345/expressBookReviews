const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
public_users.post("/register", (req,res) => {
    const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try {
    data = await books;
  return res.send(JSON.stringify(data));
  } catch {
    return res.status(404).json({message: "Error fetching data"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  try{
    const isbn = req.params.isbn;
    books1 = await books[isbn];
    return res.send(books1);
  } catch {
    return res.status(404).json({message: "Error fetching data"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
      
      // Create a Promise to find the author
      const findAuthor = new Promise((resolve, reject) => {
        const booksByAuthor = [];
        for (let i in books) {
          if (books[i].author === author) {
            booksByAuthor.push(books[i]);
          }
        }
        if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
        } else {
          reject("Author not found");
        }
      });
  
      // Wait for the Promise to resolve or reject
      const result = await findAuthor;
  
      // Send the result if author is found
      res.send(result);
    } catch (error) {
      // Handle errors if author is not found or any other errors occur
      res.status(404).send("Author not found");
    }
  });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
      
      // Wrap the logic inside a Promise
      const findtitle = new Promise((resolve, reject) => {
        for (let i in books) {
          if (books[i].title == title) {
            resolve(books[i]);
            return;
          }
        }
        reject("book not found");
      });
  
      // Wait for the Promise to resolve or reject
      const result = await findtitle;
  
      // Send the result if author is found
      res.send(result);
    } catch (error) {
      // Handle errors if author is not found or any other errors occur
      res.status(404).send("book not found");
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
    
    
 
});

module.exports.general = public_users;
