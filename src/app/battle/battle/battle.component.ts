import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokeapiService } from 'src/app/pokeapi.service';
import { UsersService } from 'src/app/users.service';
import type { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

type BattlePokemon = {
  pokemon: any;
  maxHp: number;
  hp: number;
  attack: number;
  defense: number;
};

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
})
export class BattleComponent implements OnInit, OnDestroy {
  selectedPokemon: BattlePokemon | null = null;
  opponentPokemon: BattlePokemon | undefined;
  pokemonList: any[] = [];
  userChangedSubscription: Subscription | undefined;
  battleStarted = false;
  battleOver = false;

  constructor(private pokeapiService: PokeapiService, private usersService: UsersService) { }

  ngOnInit() {
    this.userChangedSubscription = this.usersService.userChanged.subscribe(() => {
      this.getPokemonList();
    });
    this.getPokemonList().then(() => {
      this.selectPokemon(this.pokemonList[0]);
    });
  }

  ngOnDestroy() {
    this.userChangedSubscription!.unsubscribe();
  }

  async getPokemonList() {
    const user = this.usersService.currentUser;

    for (const pokemonId of user?.pokemons ?? []) {
      if (this.pokemonList.find(pokemon => pokemon.id === pokemonId)) continue;
      this.pokemonList.push(await this.pokeapiService.getPokemon(pokemonId));
    }
  }

  async selectOpponentPokemon() {
    const pokemon = await this.pokeapiService.getRandomPokemon()

    this.opponentPokemon = {
      pokemon,
      maxHp: pokemon['stats'][0].base_stat,
      hp: pokemon['stats'][0].base_stat,
      attack: pokemon['stats'][1].base_stat,
      defense: pokemon['stats'][2].base_stat,
    };
  }

  async onChangePokemon(event: any) {
    console.log(event.target.value)
    const pokemon = this.pokemonList.find(pokemon => pokemon.id === Number(event.target.value));
    await this.selectPokemon(pokemon);
  }

  async selectPokemon(pokemon: any) {
    this.selectedPokemon = {
      pokemon,
      maxHp: pokemon['stats'][0].base_stat,
      hp: pokemon['stats'][0].base_stat,
      attack: pokemon['stats'][1].base_stat,
      defense: pokemon['stats'][2].base_stat,
    };
  }

  async startBattle() {
    this.battleStarted = true;
    this.battleOver = false;
    this.selectPokemon(this.selectedPokemon!.pokemon);
    await this.selectOpponentPokemon();
  }

  attackDamage(attacker_attack: number, defender_defense: number) {
    const randomMultiplier = Math.random() * 0.60 + 0.70;
    // Hardcoded level 5 and 70 base power
    const damage = ((2 * 5 / 5 + 2) * attacker_attack * 70 / defender_defense) / 50 + 2

    return Math.floor(damage * randomMultiplier);
  }

  attack() {
    this.opponentPokemon!.hp -= this.attackDamage(this.selectedPokemon!.attack, this.opponentPokemon!.defense);

    if (this.opponentPokemon!.hp <= 0) {
      this.opponentPokemon!.hp = 0;
      this.battleOver = true;

      // Add pokemon to user
      const user = this.usersService.currentUser;
      user?.addPokemon(this.opponentPokemon!.pokemon.id);
      this.usersService.updateUser(user!);

      Swal.fire({
        title: 'You won!',
        text: 'You won the battle, and got the pokemon!',
        icon: 'success',
      });
      return;
    }

    this.opponentAttack();
  }

  heal() {
    // Heal to max hp
    this.selectedPokemon!.hp = this.selectedPokemon!.maxHp;
    this.opponentAttack();
  }

  opponentAttack() {
    const dmg = this.attackDamage(this.opponentPokemon!.attack, this.selectedPokemon!.defense);
    this.selectedPokemon!.hp -= dmg;

    if (this.selectedPokemon!.hp <= 0) {
      this.selectedPokemon!.hp = 0;
      this.battleOver = true;
      Swal.fire({
        title: 'You lost!',
        text: 'You lost the battle!',
        icon: 'error',
      });
    } else {
      Swal.fire({
        text: `Opponent attacked you for ${dmg} damage`,
        toast: true,
        position: 'bottom',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
}
