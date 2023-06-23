### BLOG API

Using Postman to simulate requests.

Tried adding Typescript again, but I am still struggling and would much rather focus on continuing the project and consolidating my knowledge.

What I've tried:

1. [Article of how to setup Node with TS](https://blog.logrocket.com/how-to-set-up-node-typescript-express/)
2. [Article about recent practices](https://fireship.io/lessons/typescript-nodejs-setup/)

# Issues encountered along the way:

When thinking about error handling, the first issue that came to my mind was

### 1. How do I handle the error of when an user will insert a post id that doesn't exist?

I've tried checking if the post is strict equal to null, but it didn't work. The error I was getting was `Cast to ObjectId failed for value "1" (type string) at path "_id" for model "Post"`

So I went ahead and checked and found this thread on [stackoverflow](https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id) where I can use a Regex pattern to check if my path parameter is indeed a valid object id according to mongoose so I can use the `findById()` method.

However, I will still have to check if the valid object id returns an existing post or not. For example someone might change just a singular string inside the `_id` and it would still be valid

And it worked!!! Yay <3
