import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import {AuthService} from '@/app/core/services/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    templateUrl: './app.topbar.html',
})
export class AppTopbar {

    items!: MenuItem[];

    layoutService = inject(LayoutService);
    private authService = inject(AuthService);
    private router = inject(Router);


    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    //permite al usuario cerrar sesion al presionar el boton de logout, redirigiendolo a la pagina de login
    logout() {

        this.authService.logout().subscribe({

            next: respuesta => {
            this.router.navigate(['/login']);
            console.log(respuesta);
            }

        });

    }

    



}
