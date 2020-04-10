const router = require("express").Router(); // isolated instance of middleware and routes
const verify = require("./verifyToken");

/* Example: When we login, after, we want to make more requests such as posting something or blogging. Once we make that post, it doesn't know that we've already logged in.
During login, we'll get a token that verifies each of our requests every time we make on.
If we want to make a request, we show that token for validation, and knows that we're logged in.
*/


router.get("/", verify, (req, res) => {
    res.send(req.user); // req.user is id retrieved from verifying token
});

module.exports = router;
