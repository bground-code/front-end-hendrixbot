import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {StoryService} from "../../client/story.service";
import {ToastrService} from "ngx-toastr";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";


interface DialogStep {
  intentName: string;
  actionText: string;
}

interface DialogData {
  story?: {
    id: number;
    name: string;
    steps: DialogStep[];
  };
}

@Component({
  selector: 'app-create-dialog-modal',
  standalone: true,
  imports: [MatDialogModule, FormsModule, NgForOf, ReactiveFormsModule],
  templateUrl: './create-dialog-modal.component.html',
  styleUrl: './create-dialog-modal.component.scss'
})

export class CreateDialogModalComponent implements OnInit {
  dialogForm: FormGroup;
  intents: any[] = [];
  actions: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<CreateDialogModalComponent>,
    private storyService: StoryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dialogForm = this.fb.group({
      name: ['', Validators.required],
      steps: this.fb.array([])
    });
  }
  get steps() {
    return this.dialogForm.get('steps') as FormArray;
  }
  initializeForm() {
    this.dialogForm = this.fb.group({
      name: ['', Validators.required],
      steps: this.fb.array([])
    });
  }
  ngOnInit() {
    this.loadDependencies();
    if (this.data && this.data.story) {
      this.loadDialogData(this.data.story);
    }
  }

  loadDialogData(story: { name: string; steps: DialogStep[] }) {
    this.dialogForm.patchValue({ name: story.name });
    story.steps.forEach(step => this.addStep(step));
  }

  addStep(step?: DialogStep) {
    const steps = this.dialogForm.get('steps') as FormArray;
    steps.push(this.fb.group({
      intentName: [step ? step.intentName : '', Validators.required],
      actionText: [step ? step.actionText : '', Validators.required]
    }));
  }

  loadDependencies() {
    this.storyService.fetchIntents().subscribe(data => this.intents = data);
    this.storyService.fetchActions().subscribe(data => this.actions = data);
  }

  onSubmit() {
    if (this.dialogForm.valid) {
      const storyData = this.dialogForm.value;
      if (this.data && this.data.story && this.data.story.id) {
        this.updateStory(storyData, this.data.story.id);
      } else {
        this.createStory(storyData);
      }
    } else {
      this.toastr.error('Todos os campos devem ser preenchidos!');
    }
  }

  createStory(storyData: any) {
    this.storyService.createStory(storyData).subscribe({
      next: () => {
        this.toastr.success('Diálogo criado com sucesso!');
        this.dialogRef.close();
      },
      error: () => this.toastr.error('Erro ao criar diálogo.')
    });
  }

  updateStory(storyData: any, storyId: number) {
    this.storyService.updateStory(storyId, storyData).subscribe({
      next: () => {
        this.toastr.success('Diálogo atualizado com sucesso!');
        this.dialogRef.close();
      },
      error: () => this.toastr.error('Erro ao atualizar diálogo.')
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
