"use client";

import Image from 'next/image';
import Characters from '../../components/characters'; 

export default function index() {
  return (
    <div>
      <h1>Welcome to the Rick and Morty App</h1>
      <Characters />
    </div>
  );
}
