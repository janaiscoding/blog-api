### BLOG API

[Live Blog](https://janaiscoding-blog.vercel.app/) | [Blog Repo](https://github.com/janaiscoding/blog-client/tree/main) | [CMS Repo](https://github.com/janaiscoding/blog-cms/tree/main)

### API Endpoints:

| API endpoints                                    | Description                                      |
| ------------------------------------------------ | ------------------------------------------------ |
| https://janas-blog-api.fly.dev/posts             | GET - Not protected, Retrieve all existing posts |
| https://janas-blog-api.fly.dev/posts/new         | POST - Protected, create a new post              |
| https://janas-blog-api.fly.dev/posts/:id         | POST - Not protected, create a new comment       |
| https://janas-blog-api.fly.dev/posts/:id         | PUT/DELETE - Protected, on existing posts        |
| https://janas-blog-api.fly.dev/posts/:id/:commID | PUT/DELETE - Protected, on existing comments     |
| https://janas-blog-api.fly.dev/signup            | POST request to sign up a new user               |
| https://janas-blog-api.fly.dev/login             | POST request to login up a new user              |

### Installation and running

```
git clone git@github.com:janaiscoding/blog-api.git
cd blog-api
npm install
npm run serverstart
Server is listening on localhost:3000
```

# Built with

## Technologies 

- Express.js (Node.js)
- Mongoose (MongoDB)
- JavaScript

## Tools Used

- Postman
- Visual Studio Code
- npm package manager
- Linux Terminal
- Git and Github