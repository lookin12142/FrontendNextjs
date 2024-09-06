import TfIdf from 'tf-idf';

const tfidf = new TfIdf();

export const calculateTfIdf = (characters) => {
  characters.forEach(character => {
    tfidf.addDocument(character.name);
  });
};

export const getTfIdfScores = (query) => {
  const scores = tfidf.tfidf(query);
  return scores.map((score, index) => ({ index, score }));
};
