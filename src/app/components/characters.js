"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import { removeStopwords } from 'stopword';

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/rickandmorty/characters');
        const characters = response.data.results;
        setCharacters(characters);
        calculateTfIdf(characters);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const calculateTfIdf = (characters) => {
    const documents = characters.map(character => character.name + ' ' + character.status + ' ' + character.species);
    const tfidfScores = documents.map((doc, index) => {
      const words = removeStopwords(doc.split(' '));
      const tfidf = words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
      return { ...characters[index], tfidfScore: Object.values(tfidf).reduce((a, b) => a + b, 0) };
    });

    setFilteredCharacters(tfidfScores.sort((a, b) => b.tfidfScore - a.tfidfScore));
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = characters.filter(character =>
        character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.gender.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCharacters(filtered);
    } else {
      calculateTfIdf(characters);
    }
  }, [searchTerm, characters]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Rick and Morty Characters</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <input className='text-black'
        type="text"
        placeholder="Search characters..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
        {filteredCharacters.map(character => (
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
            <p>TF-IDF Score: {character.tfidfScore ? character.tfidfScore.toFixed(2) : 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Characters;
