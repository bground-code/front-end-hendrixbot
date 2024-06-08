import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { TokenInterceptor } from './client/TokenInterceptor';

import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  CardHeaderComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { faGear, faHome, faUser } from '@fortawesome/free-solid-svg-icons';

import { VisualizarConversaComponent } from './components/historico/visualizar.component';
import { HistoricoComponent } from './components/historico/historico.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    VisualizarConversaComponent,
    HistoricoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    CardGroupComponent,
    InputGroupComponent,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    RowComponent,
    ContainerComponent,
    ButtonDirective,
    FormControlDirective,
    InputGroupTextDirective,
    IconDirective,
    FormDirective,
    ToastrModule.forRoot(),
    CardHeaderComponent,
    HeaderComponent,
    SideBarComponent,
  ],
  providers: [
    provideAnimations(),
    provideToastr(),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faGear, faHome, faUser);
  }
}
