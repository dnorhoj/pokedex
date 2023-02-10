import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import { AuthComponent } from './start/auth/auth.component';
import { PokemonListComponent } from './my-pokemons/pokemon-list/pokemon-list.component';
import { CatchPokemonComponent } from './my-pokemons/catch-pokemon/catch-pokemon.component';
import { BattleComponent } from './battle/battle/battle.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    AuthComponent,
    PokemonListComponent,
    CatchPokemonComponent,
    BattleComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
