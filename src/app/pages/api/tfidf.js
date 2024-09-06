import natural from 'natural';

const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

export default function handler(req, res) {
  const { characters, query } = req.body;

  characters.forEach(character => {
    tfidf.addDocument(character.name);
  });

  const scores = [];
  tfidf.tfidfs(query, (i, measure) => {
    scores.push({ index: i, score: measure });
  });

  res.status(200).json(scores);
}
