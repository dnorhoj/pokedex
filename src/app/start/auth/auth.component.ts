import { Component } from '@angular/core';
import { UsersService } from 'src/app/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  constructor(private usersService: UsersService) { }

  register() {
    // Open a modal with a form to register a new user
    Swal.fire({
      title: 'Register',
      html: `
        <input id="username" class="swal2-input" type="text" placeholder="Username">
        <input id="password" class="swal2-input" type="password" placeholder="Password">
      `,
      focusConfirm: false,
      preConfirm: async () => {
        const usernameInput = Swal.getPopup()?.querySelector('#username') as HTMLInputElement;
        const passwordInput = Swal.getPopup()?.querySelector('#password') as HTMLInputElement;
        if (!usernameInput.value || !passwordInput.value) {
          Swal.showValidationMessage('Please enter username and password');
          return;
        }

        console.log('Adding user', { username: usernameInput.value, password: passwordInput.value })
        try {
          await this.usersService.addUser(usernameInput.value, passwordInput.value);
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Registered! Please login',
            showConfirmButton: false,
            timer: 1500
          })
        } catch (e) {
          Swal.showValidationMessage("Username already exists!");
          return;
        }
      }
    })
  }

  login() {
    Swal.fire({
      title: 'Login',
      html: `
        <input id="username" class="swal2-input" type="text" placeholder="Username">
        <input id="password" class="swal2-input" type="password" placeholder="Password">
      `,
      focusConfirm: false,
      preConfirm: async () => {
        const usernameInput = Swal.getPopup()?.querySelector('#username') as HTMLInputElement;
        const passwordInput = Swal.getPopup()?.querySelector('#password') as HTMLInputElement;
        if (!usernameInput.value || !passwordInput.value) {
          Swal.showValidationMessage('Please enter username and password');
          return;
        }

        try {
          const user = await this.usersService.login(usernameInput.value, passwordInput.value);
          Swal.fire('Success!', `Welcome ${user.username}`, 'success');
        } catch (e) {
          Swal.showValidationMessage('Wrong username or password');
          return;
        }
      }
    })
  }
}
