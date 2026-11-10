
import { Routes } from '@angular/router';

import { StudentsPage } from './pages/students-page/students-page';
import { PlaceholderPage } from './pages/placeholder-page/placeholder-page';
import { LoginPage } from './pages/login-page/login-page';
import { authGuard } from './guards/auth.guard';
import { ProfilePage } from './pages/profile-page/profile-page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'students',
    pathMatch: 'full'
  },
  {
    path: 'students',
    component: StudentsPage,
    title: 'Students · GIU Yearbook'
  },
  {
    path: 'login',
    component: LoginPage,
    title: 'Student login · GIU Yearbook'
  },
  {
  path: 'profile',
  component: ProfilePage,
  canActivate: [authGuard],
  title: 'My profile · GIU Yearbook'
},
  {
    path: '**',
    redirectTo: 'students'
  }


];
