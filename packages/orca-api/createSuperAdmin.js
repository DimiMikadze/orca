/* eslint-disable */
require('dotenv').config({
  path: './packages/orca-api/.env',
});
const mongoose = require('mongoose');

// Get the email address from the command line arguments.
const email = process.argv[2];

if (!email) {
  console.log('');
  console.log('Please provide an email address.');
  console.log('');
  process.exit(1);
}

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
if (!email.match(emailRegex)) {
  console.log('');
  console.log('😥 The email address is not valid.');
  console.log('');
  process.exit(1);
}

async function connectToDb() {
  try {
    const client = await mongoose.connect(process.env.MONGO_URL, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    return client.connection.db;
  } catch (error) {
    console.log('DB connection failed', error);
    process.exit(1);
  }
}

async function init() {
  const db = await connectToDb();
  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    console.log('');
    console.log('😥 A user with a given email address already exists.');
    console.log('');
    process.exit(1);
  }

  try {
    await db.collection('users').insertOne({
      role: 'SuperAdmin',
      emailVerified: true,
      isOnline: true,
      posts: [],
      likes: [],
      comments: [],
      followers: [],
      following: [],
      notifications: [],
      messages: [],
      fullName: 'orca',
      email: email,
      password: '$2b$10$1jh4oZFtCB1o2hWY2YRWF.Kouvm8sbooPnSPwmV9HMNoujstehb2K',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('');
    console.log('✅ A super admin user has been created successfully.');
    console.log('');
    console.log('ℹ️  The login credentials are:');
    console.log('');
    console.log('- Email:    ', email);
    console.log('- Password: ', 'orcaorca');
    console.log('');
    console.log("ℹ️  You can change the profile information and the password from the setting's account page.");
    console.log('');
    process.exit();
  } catch (error) {
    console.log('');
    console.log('😥 An error occurred while creating a super admin user, error: ', error);
    console.log('');
    process.exit(1);
  }
}

init();
