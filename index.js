import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client'; 

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Blog API');
});




// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get specific user + their posts
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create user
app.post('/users', async (req, res) => {
  const { firstName, lastName, emailAddress, username } = req.body;

  try {
    const user = await prisma.user.create({
      data: { firstName, lastName, emailAddress, username },
    });
    res.status(201).json(user);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      // Prisma error for unique constraint violation
      return res.status(409).json({
        error: `A user with that ${error.meta.target} already exists.`,
      });
    }

    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});


// Update a user
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, emailAddress, username } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        emailAddress,
        username,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id }
    });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});





// Get all posts + author details
app.get('/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true },
    });
    res.status(200).json(posts);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post + author
app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create post
app.post('/posts', async (req, res) => {
  const { title, content, authorId } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: authorId } },
      },
    });
    res.status(201).json(post);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post
app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, isDeleted } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { title, content, isDeleted },
    });
    res.json(post);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({ where: { id } });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});




const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
