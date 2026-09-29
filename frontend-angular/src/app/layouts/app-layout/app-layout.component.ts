import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside class="w-64 bg-indigo-800 text-white flex flex-col">
        <div class="p-4 text-xl font-bold border-b border-indigo-700">College ERP</div>
        <nav class="flex-1 p-4 space-y-2">
          <a routerLink="/dashboard" routerLinkActive="bg-indigo-900" class="block py-2 px-4 rounded hover:bg-indigo-700">Dashboard</a>
          <a routerLink="/students" routerLinkActive="bg-indigo-900" class="block py-2 px-4 rounded hover:bg-indigo-700">Students</a>
        </nav>
        <div class="p-4 border-t border-indigo-700">
          <button (click)="logout()" class="w-full py-2 px-4 bg-indigo-600 rounded hover:bg-indigo-500">Logout</button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <header class="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">Welcome</h2>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600 font-medium">{{ authService.currentUser()?.username }}</span>
          </div>
        </header>
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AppLayoutComponent {
  authService = inject(AuthService);
  
  logout() {
    this.authService.logout();
  }
}
