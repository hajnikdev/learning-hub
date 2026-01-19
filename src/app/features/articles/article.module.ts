import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleComponent } from './article.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', runGuardsAndResolvers: 'always', component: ArticleComponent },
    ]),
  ],
  exports: [],
})
export class ArticleModule {}
