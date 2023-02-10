import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokeapiService } from 'src/app/pokeapi.service';
import { UsersService } from 'src/app/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
})
export class PokemonListComponent implements OnInit, OnDestroy {
  pokemonList: any[] = [];
  private userChangedSubscription: any;

  constructor(private pokeapiService: PokeapiService, private usersService: UsersService) { }

  ngOnInit() {
    // Vi vil have en liste over pokemons, når brugeren ændrer sig (f.eks. tilføjer en ny pokemon)
    this.userChangedSubscription = this.usersService.userChanged.subscribe(() => {
      this.getPokemonList()
    });
    this.getPokemonList();
  }

  ngOnDestroy() {
    this.userChangedSubscription.unsubscribe();
  }

  async getPokemonList() {
    const user = this.usersService.currentUser;

    for (const pokemonId of user?.pokemons ?? []) {
      if (this.pokemonList.find(pokemon => pokemon.id === pokemonId)) continue;
      this.pokemonList.push(await this.pokeapiService.getPokemon(pokemonId));
    }
  }

  delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this pokemon!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.value) {
        if (this.usersService.currentUser) {
          this.usersService.currentUser.removePokemon(id);
          this.usersService.updateUser(this.usersService.currentUser);
          this.pokemonList = this.pokemonList.filter(p => p.id !== id);
        }
      }
    });
  }
}
