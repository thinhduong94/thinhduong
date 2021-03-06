import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  MatButtonModule, 
  MatCardModule,
  MatDialog,
  MatDialogModule,
  MatIconModule, 
  MatFormFieldModule,
  MatInputModule, 
  MatListModule,
  MatSidenavModule, 
  MatToolbarModule,
  MatTabsModule,
  MatProgressSpinnerModule,
  MatTabNav,
  MatAutocompleteModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatGridListModule, 
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule, 
    MatCardModule,
    MatDialogModule,
    MatIconModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatListModule,
    MatSidenavModule, 
    MatToolbarModule, 
    MatInputModule,
    MatToolbarModule, 
   MatButtonModule, 
   MatCardModule, 
   MatInputModule, 
   MatDialogModule, 
   MatAutocompleteModule,
   MatProgressSpinnerModule,
   MatProgressBarModule,
   MatSnackBarModule,
   MatGridListModule,
   BrowserAnimationsModule
  ],
  exports: [
    MatButtonModule, 
    MatCardModule,
    MatDialogModule,
    MatIconModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatListModule,
    MatSidenavModule, 
    MatToolbarModule, 
    MatTabsModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatGridListModule,
    BrowserAnimationsModule
  ],
  declarations: [],
  providers: [
    MatDialog
  ]
})
export class MaterialModule { }
