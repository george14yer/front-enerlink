import { Routes } from '@angular/router';

import { Crud } from './crud/crud';
import { Vivienda } from './vivienda/vivienda/vivienda';
import { Gateway } from  './gateway/gateway/gateway';
import { Nodo } from './nodo/nodo/nodo';

export default [
    
    { path: 'crud', component: Crud },
    { path: 'vivienda', component: Vivienda },
    { path: 'gateway', component: Gateway },
    { path: 'nodo', component: Nodo }


] as Routes;
