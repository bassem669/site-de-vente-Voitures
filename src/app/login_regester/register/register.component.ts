import { Component } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder, private loginservice: LoginService,private snackBar: MatSnackBar,private router: Router) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [this.validPassword, this.matchPassword],
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validPassword(form: FormGroup) {
    const password = form.get('password')?.value;
    const UpperCase = /[A-Z]/.test(password);
    const LowerCase = /[a-z]/.test(password);
    const Number = /[0-9]/.test(password);

    return UpperCase && LowerCase && Number;
    
  }

  matchPassword(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword;
  
  }

  disblaybtn(){
    let checkbox = document.getElementById("checkbox") as HTMLInputElement;
    if (checkbox.checked) {
      return true;
    } else {
      return false;
    }
  }

  onSubmit() {
    if (!this.disblaybtn()){
      this.snackBar.open('Please accept the terms and conditions', 'Close', { duration:3000 });
      return;
    }
    if(!this.validPassword(this.registerForm)){
      alert('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.');
      return;
    }
    if(!this.matchPassword(this.registerForm)){
      alert('Les mots de passe ne sont pas identiques.');
      return;
      }

    if (this.registerForm.valid) {
      let formData = this.registerForm.value;
      formData = {
        ...this.registerForm.value,
        type: 'user',
      };
      console.log(formData);
      this.loginservice.existe(formData.email).subscribe({
        next: (userExists) => {
          if (userExists.length == 0) {
            this.loginservice.register(formData).subscribe({
              next: () => {this.snackBar.open('Register successful!', 'Close', { duration: 3000 });
              this.router.navigate(['/login'])},
              error: (err) => this.snackBar.open('Register failed!', 'Close', { duration: 3000 }),});
          } else {
            console.log(userExists);           
            this.snackBar.open('Email already exists!', 'Close', { duration: 3000 })}}});  
    }else{
      this.snackBar.open('Form no valid', 'Close', { duration: 3000 })
    }
  }
}
