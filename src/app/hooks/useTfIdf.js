
import { useState, useEffect } from 'react';
import natural from 'natural';

const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

const useTfIdf = (characters) => {
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (characters.length > 0) {
      characters.forEach(character => {
        tfidf.addDocument(character.name);
      });
    }
  }, [characters]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    const scores = [];
    tfidf.tfidfs(e.target.value, (i, measure) => {
      scores.push({ index: i, score: measure });
    });
    const sortedScores = scores.sort((a, b) => b.score - a.score);
    const results = sortedScores.map(score => characters[score.index]);
    setSearchResults(results);
  };

  return { searchResults, query, handleSearch };
};

export default useTfIdf;
