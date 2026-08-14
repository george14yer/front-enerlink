import { Routes } from '@angular/router';
import {authGuard} from './app/core/guards/auth.guard';
import { AppLayout } from '../src/app/layout/component/app.layout/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';




export const appRoutes: Routes = [

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
    path: 'login',
    loadComponent: () =>
      import('./app/pages/auth/login/login')
        .then(c => c.Login)
    },
    
    {
    path: '',
    canActivate: [authGuard],
    //canActivateChild: [authGuard],
    component: AppLayout,
        children: [
            { path: 'dashboard', component: Dashboard },
            //{ path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
           
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    
    
    //{ path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    //{ path: '**', redirectTo: '/notfound' }
];
