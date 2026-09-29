import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">Students</h1>
      <p class="mt-4 text-gray-500">Students module placeholder.</p>
    </div>
  `
})
export class StudentsComponent {
}
