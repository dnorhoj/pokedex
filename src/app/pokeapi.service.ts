import { Injectable } from '@angular/core';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  [key: string]: any; // Not all pokemons have the same properties
}

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  // This service fetches data from the PokeAPI
  cachedPokemonList: any;
  cachedPokemons: any = {};

  constructor() { }

  // Get pokemons from PokeAPI
  async getPokemons() {
    if (this.cachedPokemonList) {
      return this.cachedPokemonList;
    }

    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151'); // 151 pokemons i 1. generation
    const data = await response.json();

    this.cachedPokemonList = data.results;

    return data.results;
  }

  async getPokemon(id: number) {
    if (this.cachedPokemons[id]) {
      return this.cachedPokemons[id];
    }

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();

    this.cachedPokemons[id] = data;

    return data;
  }

  async getRandomPokemon(): Promise<Pokemon> {
    // Get a random pokemon from the list of pokemons
    const randomId = Math.floor(Math.random() * 151) + 1;

    return await this.getPokemon(randomId);
  }
}
