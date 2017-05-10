// in memory database for testing

var _postsCount = 0;
var Post = function(user, content) {
  this.id = ++_postsCount;
  this.user_id  = user.id;
  this.username = user.username;
  this.user     = user;
  this.content  = content;
};

Post.create = function(user, content) {
  var post = new Post(user, content);
  return post;
};


var _followCount = 0;
var Follow = function(user, other) {
  this.id = ++_followCount;
  this.user_id   = user.id;
  this.user      = user;
  this.follow_id = other.id;
  this.username  = other.username;
  this.folows    = other;
};

Follow.create = function(user, other) {
  var follow = new Follow(user, other);
  return follow;
};


var _users = {} // id => user object
var _usersCount = 0;
var User = function(username) {
  this.id = ++_usersCount;
  this.username = username;
  this.password = null;
  this.posts    = [];
  this.follows  = [];
};

User.getAll = function() {
  return _users;
}

User.findByUsername = function(username) {
  for(var id in _users) {
    if (_users[id].username === username) {
      return _users[id];
    }
  }
  return null;
};

User.findByToken = function(token) {
  for(var id in _users) {
    if (_users[id].token === token) {
      return _users[id];
    }
  }
  return null;
};

User.create = function(username, password, token) {
  var user = new User(username);
  user.password = password;
  user.token = token || Math.random().toString(36).substr(2);
  _users[user.id] = user;
  return user;
};

User.prototype.authenticate = function(password) {
  return this.password === password;
};

User.prototype.addPost = function(content) {
  var post = Post.create(this, content);
  this.posts.unshift(post);
  return post;
};

User.prototype.getPosts = function() {
  return this.posts;
};

User.prototype.addFollow = function(other) {
  var follow = Follow.create(this, other);
  this.follows.unshift(follow);
  return follow;
};

User.prototype.getFollows = function() {
  return this.follows;
};

// Seed some users
var user = User.create('user', 'sample', 'qwertyuiopasdfghjkl');
var michu = User.create('michu', 'sample', 'poiuytrewqlkjhgfdsa');
var sir = User.create('sir', 'sample', 'zxcvbnmqwertlkjhg');

user.addPost("#Boston #USA #Explore I'm here and I want to see more then hotel room.");
user.addPost("#Barcelona #Spain #Cofee Somebody wants get cofee time with me?");
user.addPost("#Poznan #Poland #OldTown I can speak in italy and I want to see old town, somebody?");
user.addPost("#Warszawa #Poland #City I want to explore night city life. I can speak in italy.");

michu.addPost("#Berlin #Germany #dinner Somebody want to meet with me and has a dinner, I can speak in polish.");
michu.addPost("#Paris #France #Eiffel I'm from Poland I want to go to this tower with somebody.");

sir.addPost("#Amsterdam #Netherlands #bikes I am from Germany, maybe somebody want to ride with me?");
sir.addPost("#Pekin #China #Explore I am from Germany and I want explore city");
sir.addPost("#London #UK #Lunch I speak in german and I want eat some good lunch in London city.");

user.addFollow(michu);
user.addFollow(sir);

michu.addFollow(user);
michu.addFollow(sir);

sir.addFollow(user);

exports.User = User;
