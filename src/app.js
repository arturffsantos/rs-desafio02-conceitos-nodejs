const express = require('express');
const cors = require('cors');

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

// middleware to check if id is an valid uuid and if exists in repositories
function validateRepositoryId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid repository id' });
  }

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'repository not found' });
  }

  req.repositoryIndex = repositoryIndex;

  return next();
}

const repositories = [];

app.get('/repositories', (req, res) => {
  return res.json(repositories);
});

app.post('/repositories', (req, res) => {
  const { title, url, techs } = req.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return res.status(201).json(repository);
});

app.put('/repositories/:id', validateRepositoryId, (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const likes = repositories[req.repositoryIndex].likes;

  const repository = { id, title, url, techs, likes };

  repositories[req.repositoryIndex] = repository;

  return res.json(repository);
});

app.delete('/repositories/:id', validateRepositoryId, (req, res) => {
  const { id } = req.params;

  repositories.splice(req.repositoryIndex, 1);

  return res.status(204).send();
});

app.post('/repositories/:id/like', validateRepositoryId, (req, res) => {
  repositories[req.repositoryIndex].likes += 1;

  return res.status(201).json(repositories[req.repositoryIndex]);
});

module.exports = app;
