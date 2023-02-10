export class User {
  id: number;
  username: string;
  password: string;
  pokemons: number[];

  constructor(id: number, username: string, password: string, pokemons: number[] = []) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.pokemons = pokemons;
  }

  addPokemon(pokemonId: number) {
    this.pokemons.push(pokemonId);
    this.pokemons.sort((a, b) => a - b)
  }

  removePokemon(pokemonId: number) {
    this.pokemons = this.pokemons.filter(pokemon => pokemon !== pokemonId);
  }

  hasPokemon(pokemonId: number) {
    return this.pokemons.includes(pokemonId);
  }

  getPokemons() {
    return this.pokemons;
  }

  static fromJSON(json: any) {
    return new User(json.id, json.username, json.password, json.pokemons);
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      pokemons: this.pokemons
    };
  }
}
