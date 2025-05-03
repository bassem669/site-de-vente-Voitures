import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { login } from '../login.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginform: FormGroup;
  showPassword: boolean = false;

  constructor(
    private loginservice: LoginService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginform = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  Onsubmit() {
    if (this.loginform.valid) {
      const formData = this.loginform.value;
      this.loginservice.getuser(formData).subscribe({
        next: (res) => {
          if (res.length) {
            this.loginservice.AjouterLogin(res[0]).subscribe({
              next: () => {this.snackBar.open('Login successful!', 'Close', { duration: 3000 });},
              error: (err) => this.snackBar.open('Register failed!', 'Close', { duration: 3000 }),});
            this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
            this.router.navigate([''])
          } else {
            this.snackBar.open('Invalid email or password', 'Close', { duration: 3000 });
          }
        },
        error: (err) => {
          console.error('Error during authentication:', err);
          this.snackBar.open('An error occurred. Please try again.', 'Close', { duration: 3000 });
        },
      });
    } else {
      this.snackBar.open('Please fill all the fields correctly', 'Close', { duration: 3000 });
    }
  }
}
