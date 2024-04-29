const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let username1 = '';
let users= []
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}


const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }
//only registered users can login
regd_users.get('/logout', (req, res) => {
    // Invalidate the session (assuming session middleware is used)
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
      } else {
        console.log('Session destroyed');
        // Clear client-side authentication state (if applicable)
        res.clearCookie('session'); // Clear session cookie
        // Redirect to login page
        res.redirect('/login');
      }
    });
  });
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    username1 = username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 * 60});
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    let rev = {
        [username1] : review
    };
    
        books[isbn].reviews = rev;
    
    return res.status(200).json({message: "review submitted"});
        
        
        
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
