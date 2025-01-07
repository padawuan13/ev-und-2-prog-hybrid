import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonToggle, IonLabel, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CitasService } from '../services/citas.service';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.page.html',
  styleUrls: ['./configuraciones.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButtons, IonButton, IonLabel, IonToggle, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ConfiguracionesPage implements OnInit {
  permitirEliminar = false;

  toggleEliminar(event: any) {
    this.permitirEliminar = event.detail.checked;
  }

  constructor(private router: Router, private citasService: CitasService) { }

  async ngOnInit() {
    this.permitirEliminar = await this.citasService.getPermitirEliminar();
  }

  actualizarPermitirEliminar() {
      this.citasService.setPermitirEliminar(this.permitirEliminar);
  }

  ngOnChanges() {
    localStorage.setItem('permitirEliminar', this.permitirEliminar.toString());
  }

  volverAInicio() {
    this.router.navigate(['/inicio']);
  }
}
