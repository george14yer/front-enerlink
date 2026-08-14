import { Routes } from '@angular/router';
import { FormLayoutDemo } from './formlayoutdemo';
import { InputDemo } from './inputdemo';

export default [
    
    { path: 'formlayout', data: { breadcrumb: 'Form Layout' }, component: FormLayoutDemo },
    { path: 'input', data: { breadcrumb: 'Input' }, component: InputDemo },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
