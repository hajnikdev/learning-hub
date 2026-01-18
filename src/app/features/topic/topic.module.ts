import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopicComponent } from './topic.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: TopicComponent }])],
  exports: [],
})
export class TopicModule {}
