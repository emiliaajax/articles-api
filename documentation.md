# API Documentation

### /

###### GET /
Returns a JSON response containing links to articles, user registration and login and to create a new article.

### /users

###### POST /register
Registers a new user.

###### POST /login
Logs in an existing user and returns an access token.

### /articles

###### GET /
Returns a JSON response containing a list of articles with related links. Default page is 1. Default articles per page is 20. Maximum articles per page is 100.

###### GET /:id
Returns a JSON response containing one article with related links.

###### POST /
Creates a new article and returns a JSON response containing the newly created article and related links.

###### PUT /:id
Updates an existing article and returns a JSON response with related links.

###### DELETE /:id
Deletes an existing article.
