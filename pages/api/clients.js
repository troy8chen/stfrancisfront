import path from 'path';
import { promises as fs } from 'fs';

// Unused API route that works for testing purposes - returns file Clients
export default async function handler(req, res) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'public/json');
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory + '/clients.json', 'utf8');
  //Return the content of the data file in json format
  res.status(200).json(fileContents);
}