import { Component, inject } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../../core/services/auth';
import {OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule,ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './login.html',
})
export class Login {
    
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.nonNullable.group({

        correo: ['',[Validators.required, Validators.email]],

        password: ['',[Validators.required]
        ]

    });

    isLoading = false;

    login() {

        if (this.loginForm.invalid || this.isLoading) {

            this.loginForm.markAllAsTouched();

            return;

        }
        this.isLoading = true;

        this.authService.login(
        this.loginForm.getRawValue()
        ).subscribe({

        next: (response) => {
            this.isLoading = false;
            console.log('Respuesta del servidor:', response);
            this.router.navigate(['/dashboard']);
            

        },

        error: (error) => {
            this.isLoading = false;
            console.error('Error:', error);

        }

        });

    }

    perfil() {

        this.authService.me().subscribe({

            next: usuario => {

            console.log(usuario);

            },

            error: error => {

            console.error(error);

            }

        });

    }


    logout() {

        this.authService.logout().subscribe({

            next: respuesta => {

            console.log(respuesta);

            }

        });

    }

}
