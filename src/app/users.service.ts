import { Injectable } from '@angular/core';
import { User } from 'src/lib/user';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { hash, compare } from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  localStorage: Storage;
  users: User[];
  userChanged = new Subject<User>();

  constructor() {
    this.localStorage = window.localStorage;

    const json = this.localStorage.getItem('users');

    if (!json) {
      this.users = [];
      return;
    }

    try {
      this.users = JSON.parse(json).map(User.fromJSON);
    } catch (e) {
      this.users = [];
    }
  }

  loadUsers() {
  }

  saveUsers() {
    this.localStorage.setItem('users', JSON.stringify(this.users));
  }

  async addUser(username: string, password: string) {
    if (!username || !password) {
      throw new Error("Username and password are required!");
    }

    if (this.users.find(u => u.username === username)) {
      throw new Error("Username already exists!");
    }

    const hashedPassword = await hash(password, 10);

    const user = new User(
      Math.max(...this.users.map(user => user.id), 0) + 1,
      username,
      hashedPassword,
    );

    this.users.push(user);
    this.saveUsers();
  }

  getUser(id: number) {
    return this.users.find(user => user.id === id);
  }

  async login(username: string, password: string) {
    const user = this.users.find(user => user.username === username);

    if (!user) {
      throw new Error("Wrong username or password!");
    }

    if (!await compare(password, user.password)) {
      throw new Error("Wrong username or password!");
    }

    this.localStorage.setItem('currentUser', user.id.toString());

    return user;
  }

  updateUser(user: User) {
    this.users = this.users.map(u => u.id === user.id ? user : u);
    this.saveUsers();
    this.userChanged.next(user);
  }

  get currentUser() {
    const id = this.localStorage.getItem('currentUser');

    if (!id) {
      return null;
    }

    try {
      return this.getUser(parseInt(id));
    } catch (e) {
      return null;
    }
  }

  logout() {
    this.localStorage.removeItem('currentUser');
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon: 'success',
      title: 'Logged out successfully!'
    })
  }
}
