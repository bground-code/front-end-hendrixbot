import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../client/story.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  stories: any[] = [];
  intents: any[] = [];
  actions: any[] = [];
  newStepIntent: any;
  newStoryName: any;
  newStepAction: any;
  private _id: any;
  filterValue: any;

  constructor(private storyService: StoryService,     private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.loadStories();
    this.loadIntents();
    this.loadActions();
  }

  loadStories() {
    this.storyService.loadStories().subscribe(data => {
      this.stories = data;
    });
  }

  loadIntents() {
    this.storyService.fetchIntents().subscribe(data => {
      this.intents = data;
    });
  }

  loadActions() {
    this.storyService.fetchActions().subscribe(data => {
      this.actions = data;
    });
  }

  clearFilter(): void {
    this.filterValue = '';
  }

  createStory(): void {
    const newStory = {
      name: this.newStoryName,
      steps: [
        { intentName: this.newStepIntent, actionText: this.newStepAction }
      ]
    };
    this.storyService.createStory(newStory).subscribe(() => {
      this.loadStories();
      this.newStoryName = '';
      this.newStepIntent = '';
      this.newStepAction = '';
    });
  }
  updateStory(storyId: number): void {
    const story = this.stories.find(s => s.id === storyId);
    if (story) {
      this.storyService.updateStory(storyId, story).subscribe({
        next: () => {
          this.toastr.success('História atualizada com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao atualizar história:', error);
          this.toastr.error('Erro ao atualizar história. Por favor, tente novamente.');
        }
      });
    }
  }


  deleteStory(storyId: number): void {
    this.storyService.deleteStory(storyId).subscribe(() => {
      this.loadStories();
    });
  }

}
