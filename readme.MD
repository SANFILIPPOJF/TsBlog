# Template node Express typescript

install dependencies
`npm i`

start dev server
`npm start`

USERS
-Register new user: (POST)
http://localhost:8080/users/register
req: {
    name: string,
    password: string
}

-User Login: (POST)
http://localhost:8080/users/login
req: {
    name: string,
    password: string
}

ARTICLES
-Get all articles (GET)
http://localhost:8080/articles/

-Get articles by ID: (GET)
http://localhost:8080/articles/<id>

-Post new article: (POST)
http://localhost:8080/articles/
req: {
    message: string
}
-Modify article: (PATCH)
http://localhost:8080/articles/<id>
req: {
    message: string
}
-Delete article: (DELETE)
http://localhost:8080/articles/<id>


COMMENTS
-Get all comments (frome 1 article): (GET)
http://localhost:8080/comments/
req: {
    articleId: integer
}
-Post new comment: (POST)
http://localhost:8080/comments/
req: {
    articleId: integer,
    comment: string
}
-Modify a comment: (PATCH)
http://localhost:8080/comments/<id>
req: {
    comment: string
}
-Delete a comment: (DELETE)
http://localhost:8080/comments/<id>