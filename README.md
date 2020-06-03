![Logo](https://github.com/IrisvanOllefen/novel-love/blob/master/readme-images/Schermafbeelding%202020-06-03%20om%2012.12.48.png)

https://novel-love.herokuapp.com/

# Novel Love

Find Love by talking about what you love: Books!

## Job Story

When I have a new favorite book or am currently reading a different book, I want to change that on my profile, so I can find people with the same interests.

## How Does It Work

People who are interested in dating and having meaningful conversations, can use Novel Love. They can enter their top 3 favorite books of all time, and the bok they are currently reading. Then, they can find matches with an interest in the same books or genre. They can start meaningful and in-depth conversations about these books, so a start to the conversation is already made. This makes breaking the ice easier and people more approachable.

### Feature 1: Select User

On the homepage, in the header. You can select a user.

![Select User](https://github.com/IrisvanOllefen/novel-love/blob/master/readme-images/Schermafbeelding%202020-06-03%20om%2012.12.13.png)

### Feature 2: Edit profile

Your profile settings that are already known in the database will show up, but you can obviously adjust these to however you like!

![Edit Profile](https://github.com/IrisvanOllefen/novel-love/blob/master/readme-images/Schermafbeelding%202020-06-03%20om%2012.11.43.png)

### Feature 3: Upload Profile Picture

Using the multer package, I have made it possible to upload a profile picture!

![Upload Profile Picture](https://github.com/IrisvanOllefen/novel-love/blob/master/readme-images/Schermafbeelding%202020-06-03%20om%2012.11.58.png)

### Feature 4: Delete Account

And when you have found the love of your life and no longer need the Novel Love website to find somebody, you can safely delete your account and all your information will be removed from the database.

![Delete Account](https://github.com/IrisvanOllefen/novel-love/blob/master/readme-images/Schermafbeelding%202020-06-03%20om%2012.09.50.png)

## Overview of Data inside Database

``` javascript
const UserSchema = new Schema({
  profilepicture: String,
  name: String,
  age: Number,
  favoriteBooks: [String],
  currentBook: String,
  matches: [{ type: Schema.Types.ObjectId, ref: "User" }],
});
```

This is the only data inside the database and I have put it inside a schema using Mongoose.

## Tech Stack

- __Runtime__ Nodejs
- __Server__ Expressjs
- __Database__ MongoDB (+ Mongoose)

### Dependencies used

I used the following dependencies to make this website possible:

- body-parser
- express
- express-session
- hbs
- mongoose 
- multer
- dotenv

### DevDependencies used:

And I also used multiple dependencies during development:

- ESLint
- nodemon
- prettier
