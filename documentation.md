# API Endpoints

## Entry Point

`GET /`   
Returns a JSON response containing links to articles, user registration and login and to create a new article.

## Users

`POST /users/register`   
Registers a user.

`POST /users/login`   
Logs in an existing user and returns an access token.

`GET /users/:id`
Gets the username of the user with the id parameter.

`GET /users/:id/articles`
Get the articles created by the user with the id parameter.

## Articles

`GET /articles`    
Returns a JSON response containing a list of articles with related links. Default page is 1. Default articles per page is 20. Maximum articles per page is 100.

`GET /articles/:id`   
Returns a JSON response containing one article with related links.

`POST /articles`    
Creates a new article and returns a JSON response containing the newly created article and related links.

`PUT /articles/:id`   
Updates an existing article and returns a JSON response with related links.

`DELETE /articles/:id`    
Deletes an existing article.

## Webhooks

`POST /webhooks`    
Registers a webhook.
