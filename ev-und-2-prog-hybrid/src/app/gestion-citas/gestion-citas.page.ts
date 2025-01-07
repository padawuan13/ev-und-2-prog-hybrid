import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../services/citas.service';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

interface Cita {
  frase: string;
  autor: string;
}

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.page.html',
  styleUrls: ['./gestion-citas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class GestionCitasPage implements OnInit {
  citas: Cita[] = [];
  nuevaFrase = '';
  nuevoAutor = '';

  constructor(private citasService: CitasService, private router: Router) {}

  ngOnInit() {
    this.cargarCitas();
  }

   volverAInicio() {
    this.router.navigate(['/inicio']);
   }

   cargarCitas() {
    this.citas = this.citasService.getCitas();
   }

   agregarCita() {
    if (this.nuevaFrase.trim().length >= 5 && this.nuevoAutor.trim().length >= 2) {
      this.citasService.addCita(this.nuevaFrase, this.nuevoAutor); 
      this.cargarCitas(); 
      this.nuevaFrase = ''; 
      this.nuevoAutor = ''; 
    }
  }

   deleteCita(cita: { frase: string; autor: string }) {
    this.citasService.deleteCita(cita); 
    this.citas = this.citasService.getCitas();
  }

}
