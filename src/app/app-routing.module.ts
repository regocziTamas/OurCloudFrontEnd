import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilesComponent } from './files/files.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/authguard/auth.guard';


const routes: Routes = [{ path: 'files', component: FilesComponent, pathMatch: 'full', canActivate: [AuthGuard] },
{ path: 'login', component: LoginComponent, pathMatch: 'full'  },
{ path: '',   redirectTo: 'login', pathMatch: 'full' },
{ path: '**', component: PageNotFoundComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
