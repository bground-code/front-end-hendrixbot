import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../client/story.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CreateDialogModalComponent } from './create-dialog-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  styleUrls: ['./story.component.scss'],
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

  constructor(
    private storyService: StoryService,
    private toastr: ToastrService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadStories();
    this.loadIntents();
    this.loadActions();
  }

  loadStories() {
    this.storyService.loadStories().subscribe((data) => {
      this.stories = data;
    });
  }

  loadIntents() {
    this.storyService.fetchIntents().subscribe((data) => {
      this.intents = data;
    });
  }

  loadActions() {
    this.storyService.fetchActions().subscribe((data) => {
      this.actions = data;
    });
  }

  clearFilter(): void {
    this.filterValue = '';
  }

  createStory(): void {
    if (!this.newStoryName || !this.newStepIntent || !this.newStepAction) {
      this.toastr.error('Todos os campos devem ser preenchidos!');
      return;
    }

    const newStory = {
      name: this.newStoryName,
      steps: [
        { intentName: this.newStepIntent, actionText: this.newStepAction },
      ],
    };

    this.storyService.createStory(newStory).subscribe({
      next: () => {
        this.toastr.success('Diálogo criado com sucesso!');
        this.loadStories();
        this.newStoryName = '';
        this.newStepIntent = '';
        this.newStepAction = '';
      },
      error: () => {
        this.toastr.error('Erro ao criar diálogo. Tente novamente.');
      },
    });
  }

  updateStory(storyId: number, id: any): void {
    this._id = id;
    const story = this.stories.find((s) => s.id === storyId);
    if (story) {
      this.storyService.updateStory(storyId, story).subscribe({
        next: () => {
          this.toastr.success('Diálogo atualizada com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao atualizar Diálogo:', error);
          this.toastr.error(
            'Erro ao atualizar Diálogo. Por favor, tente novamente.',
          );
        },
      });
    }
  }

  deleteStory(storyId: number): void {
    this.storyService.deleteStory(storyId).subscribe(() => {
      this.loadStories();
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateDialogModalComponent, {
      width: '400px',
      position: { top: '-40%', left: '50%' },
      panelClass: 'custom-modal2-class',
      data: { story: { ...this } },
      hasBackdrop: true, // Show backdrop
      disableClose: true, // Disable closing on backdrop click
      backdropClass: 'custom-backdrop-class', // Custom class for backdrop
      autoFocus: true, // Auto-focus the first form field
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      // Optionally perform actions after dialog closes
    });
  }

  openEditDialog(story: any) {
    const dialogRef = this.dialog.open(CreateDialogModalComponent, {
      width: '600px',
      position: { top: '-40%', left: '40%' },
      panelClass: 'custom-modal2-class',
      data: { story: { ...story } },
      hasBackdrop: true, // Show backdrop
      disableClose: true, // Disable closing on backdrop click
      backdropClass: 'custom-backdrop-class', // Custom class for backdrop
      autoFocus: true, // Auto-focus the first form field
    });

    dialogRef.afterClosed().subscribe((updatedStory) => {
      if (updatedStory) {
        this.updateStory(updatedStory, story.id);
      }
    });
  }

  // Novo método trainModel
  trainModel(): void {
    this.storyService.trainModel().subscribe({
      next: () => {
        this.toastr.success('Modelo treinado com sucesso!');
      },
      error: () => {
        this.toastr.error('Erro ao treinar o modelo. Tente novamente.');
      },
    });
  }
}
