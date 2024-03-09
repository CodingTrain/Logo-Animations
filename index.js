import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public', { directory: true }));

// Parse JSON bodies for this route
app.use(express.json());

// Route to handle the POST request
app.post('/upload', (request, response) => {
  const { image, filename } = request.body;
  const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const savePath = `render/${filename}`;
  fs.writeFileSync(savePath, buffer);
  response.json({ message: 'Image saved successfully' });
});

// Listen on port 3000
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
