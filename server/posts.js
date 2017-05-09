var User = require('./models').User;
var auth = require("./auth");

var renderPost = function(post) {
  return {
    id: post.id,
    content: post.content,
    username: post.username
  };
};

var renderPosts = function(user) {
  var out = {
    posts: [],
    username: user.username
  };
  var posts = user.getPosts();
  for(var i in posts) {
    var post = posts[i];
    out.posts.push(renderPost(post));
  }

  return out;
};

var renderPostsForUser = function(currentUser, users) {
  var out = {
    posts: [],
    username: currentUser.username
  };

  for(var i in users) {
    var user = users[i];
    if (user != currentUser) {
      var posts = user.getPosts();
      for(var j in posts) {
        var post = posts[j];
        out.posts.push(renderPost(post));
      }
    }
  }

  return out;
};

exports.userPosts = function *() {
  var username = this.params.username;
  var user = User.findByUsername(username);
  if (!user) {
    this.throw("No user found", 404);
  }
  this.status = 200;
  this.body = renderPosts(user);
};

exports.postsForUser = function *() {
  var username = this.params.username;
  var currentUser = User.findByUsername(username);
  if (!currentUser) {
    this.throw("No user found", 404);
  }

  var users = User.getAll();

  this.status = 200;
  this.body = renderPostsForUser(currentUser, users);
};

exports.createPost = function *() {
  var user = this.passport.user;
  var params = this.request.body || {};
  var content = (params.content || "").trim();

  if(!content) this.throw("No content provided", 422);

  var post = user.addPost(content);

  this.status = 201;
  this.body = renderPost(post);
};
