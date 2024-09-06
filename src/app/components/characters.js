"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/end/api/characters/');
        setCharacters(response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (e) => {
    setQuery(e.target.value);
    try {
      const response = await axios.post('/api/tfidf', {
        characters,
        query: e.target.value
      });
      const sortedScores = response.data.sort((a, b) => b.score - a.score);
      const results = sortedScores.map(score => characters[score.index]);
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching TF-IDF scores:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Rick and Morty Characters</h1>
      <input
        className='text-black'
        type="text"
        placeholder="Search characters..."
        value={query}
        onChange={handleSearch}
        style={{
          padding: '10px',
          width: '100%',
          marginBottom: '20px',
          fontSize: '16px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {searchResults.map(character => (
          <div
            key={character.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '20px',
              width: '200px',
              textAlign: 'center',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h2 style={{ fontSize: '18px', margin: '10px 0' }}>{character.name}</h2>
            <img
              src={character.image}
              alt={character.name}
              style={{ width: '100%', borderRadius: '10px' }}
            />
            <p>Status: {character.status}</p>
            <p>Species: {character.species}</p>
            <p>Gender: {character.gender}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Characters;

