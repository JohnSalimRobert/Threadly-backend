import { faker } from '@faker-js/faker';
import userModel from '../models/user.model';
import postModel from '../models/post.model';
import commentModel from '../models/comment.model';


const NUM_USERS = 10;
const POSTS_PER_USER = 3;
const COMMENTS_PER_POST = 5;
const MAX_LIKES_PER_POST = 7;

export async function seed() {
  try {
    console.log('Clearing existing data...');
    await userModel.deleteMany({});
    await postModel.deleteMany({});
    await commentModel.deleteMany({});

    console.log('Creating users...');
    const users = [];
    for (let i = 0; i < NUM_USERS; i++) {
      const user = new userModel({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: 'Password123!', // plain, will be hashed by pre-save hook
        profilePicture: faker.image.avatar(),
        bio: faker.lorem.sentence()
      });
      await user.save();
      users.push(user);
    }

    console.log('Creating posts...');
    const posts = [];
    for (const user of users) {
      for (let i = 0; i < POSTS_PER_USER; i++) {
        const post = new postModel({
          author: user._id,
          caption: faker.lorem.sentence(),
          images: [faker.image.urlPicsumPhotos()],
          likes: faker.helpers.arrayElements(users.map(u => u._id), faker.number.int({ min: 0, max: MAX_LIKES_PER_POST }))
        });
        await post.save();
        posts.push(post);
      }
    }

    console.log('Creating comments...');
    for (const post of posts) {
      for (let i = 0; i < COMMENTS_PER_POST; i++) {
        const author = faker.helpers.arrayElement(users);
        const comment = new commentModel({
          post: post._id,
          author: author._id,
          content: faker.lorem.sentence(),
          likes: faker.helpers.arrayElements(users.map(u => u._id), faker.number.int({ min: 0, max: 5 }))
        });
        await comment.save();
      }
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

