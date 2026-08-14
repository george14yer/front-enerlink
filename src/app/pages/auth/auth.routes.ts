import { Routes } from '@angular/router';
import { Access } from '../auth/access/access';
import { Login } from '../auth/login/login';
import { Error } from '../auth/error/error';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    //{ path: 'login', component: Login }
] as Routes;
