import { Component } from '@angular/core';
import { PokeapiService } from 'src/app/pokeapi.service';
import { UsersService } from 'src/app/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catch-pokemon',
  templateUrl: './catch-pokemon.component.html',
})
export class CatchPokemonComponent {
  constructor(private pokeapi: PokeapiService, private users: UsersService) { }

  async catch() {
    const user = this.users.currentUser;

    if (!user) {
      Swal.fire({
        title: 'Oh no!',
        text: 'You need to be logged in to catch pokemon!',
        icon: 'error',
      })
      return;
    }

    const pokemon = await this.pokeapi.getRandomPokemon();

    const popup = await Swal.fire({
      title: 'Found pokemon!',
      html: `A wild <b>${pokemon.name.replace(/-/g, " ")}</b> appeared!`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Catch it!',
      imageUrl: pokemon.sprites.front_default,
      imageHeight: 200,
      imageWidth: 200,
      preConfirm: () => {
        Swal.showLoading();
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 2000);
        });
      }
    })

    if (!popup.value) return;

    const caught = Math.random() > 0.33; // 66% chance of catching

    if (!caught) {
      Swal.fire({
        title: 'Oh no!',
        text: 'The pokemon escaped!',
        icon: 'error',
      })
      return;
    }

    if (user.hasPokemon(pokemon.id)) {
      Swal.fire({
        title: 'Oh no!',
        text: 'You already have this pokemon!',
        icon: 'error',
      })
      return;
    }

    user.addPokemon(pokemon.id);
    this.users.updateUser(user);

    Swal.fire({
      title: 'Congratulations!',
      text: `You caught a ${pokemon.name}!`,
      icon: 'success',
    })
  }
}
