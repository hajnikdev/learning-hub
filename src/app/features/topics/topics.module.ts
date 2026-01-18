import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopicsComponent } from './topics.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: TopicsComponent }])],
  exports: [],
})
export class TopicsModule {}
