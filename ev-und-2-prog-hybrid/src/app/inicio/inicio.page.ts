import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CitasService } from '../services/citas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonIcon, IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class InicioPage implements OnInit {
  citaActual: { frase: string; autor: string } | null = null;
  permitirEliminar: boolean = false; 

  constructor(private citasService: CitasService, private router: Router) {}

  async ngOnInit() {
    this.mostrarCitaAleatoria();

    
    this.permitirEliminar = await this.citasService.getPermitirEliminar();
  }

  mostrarCitaAleatoria() {
    const citas = this.citasService.getCitas();
    if (citas.length > 0) {
      const indiceAleatorio = Math.floor(Math.random() * citas.length);
      this.citaActual = citas[indiceAleatorio];
    } else {
      this.citaActual = null;
    }
  }

  deleteCita() {
    if (this.permitirEliminar && this.citaActual) {
      this.citasService.deleteCita(this.citaActual);
      this.mostrarCitaAleatoria();
    }
  }
  

  irAConfiguraciones() {
    this.router.navigate(['/configuraciones']);
  }

  irAGestionCitas() {
    this.router.navigate(['/gestion-citas']);
  }
}
