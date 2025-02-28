import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private loginService: LoginService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email ]),
      password: this.fb.control('', [Validators.required]),
    });

    // Recupere a mensagem de erro da URL
    this.route.queryParams.subscribe(params => {
      this.errorMessage = params['error'] || '';
    });
  }

  login(){
    this.errorMessage = '';
    this.successMessage = '';
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe( 
        user => {
          this.successMessage = `Login Realizado com sucesso, Bem vindo!`;
          localStorage.setItem('accessToken', user.accessToken);
          this.router.navigate(['/home']);
        },
        error => {
          this.errorMessage = error.error;
          localStorage.removeItem('accessToken');
        }
      );
  }
}