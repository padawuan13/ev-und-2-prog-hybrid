import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';

interface Cita {
  frase: string;
  autor: string;
}

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  private sqlite: typeof CapacitorSQLite = CapacitorSQLite;
  private db: SQLiteDBConnection | null = null;
  private citas: Cita[] = [];
  private permitirEliminar = false;

  constructor() {
    this.initDatabase().then(() => {
      console.log('Base de datos inicializada');
    });
  }
  

  async initDatabase() {
    try {
      const dbName = 'citasDB';
  
      // Crear conexión a SQLite con validación de tipo
      const connection = await this.sqlite.createConnection({
        database: dbName,
        version: 1,
        encrypted: false,
        mode: 'no-encryption',
      }) as unknown as SQLiteDBConnection; // Ajuste de tipo
  
      if (!connection) {
        throw new Error('No se pudo establecer la conexión con SQLite.');
      }
  
      this.db = connection; // Asignar la conexión a this.db
      await this.db.open(); // Abrir la base de datos
  
      const query = `
        CREATE TABLE IF NOT EXISTS citas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          frase TEXT NOT NULL,
          autor TEXT NOT NULL
        );
      `;
      await this.db.execute(query);
  
      // Verificar si la tabla está vacía e insertar citas iniciales
      const countQuery = `SELECT COUNT(*) AS count FROM citas;`;
      const result = await this.db.query(countQuery);
  
      if (result.values && result.values[0].count === 0) {
        const initialCitas = [
          { frase: 'El éxito consiste en obtener lo que se desea.', autor: 'Ralph Waldo Emerson' },
          { frase: 'Las personas no son recordadas por el número de veces que fracasan.', autor: 'Thomas Edison' },
          { frase: 'Ningún viento es bueno para el barco que no sabe adónde va.', autor: 'Séneca' },
        ];
  
        for (const cita of initialCitas) {
          const insertQuery = `INSERT INTO citas (frase, autor) VALUES (?, ?);`;
          await this.db.run(insertQuery, [cita.frase, cita.autor]);
        }
      }
  
      // Cargar las citas en memoria
      await this.loadCitas();
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }
  
  

  async loadCitas() {
    try {
      if (!this.db) {
        throw new Error('La base de datos no está inicializada.');
      }
  
      const query = `SELECT * FROM citas;`;
      const result = await this.db.query(query);
  
      this.citas = result.values?.map((row: any) => ({
        frase: row.frase,
        autor: row.autor,
      })) || [];
      console.log('Citas cargadas desde SQLite:', this.citas);
    } catch (error) {
      console.error('Error al cargar las citas desde SQLite:', error);
    }
  }
  
  

  getCitas(): Cita[] {
    return this.citas;
  }

  async addCita(frase: string, autor: string) {
    try {
      if (!this.db) {
        throw new Error('La base de datos no está inicializada.');
      }
  
      const query = `INSERT INTO citas (frase, autor) VALUES (?, ?);`;
      await this.db.run(query, [frase, autor]);
  
      this.citas.push({ frase, autor });
      console.log('Cita añadida:', { frase, autor });
    } catch (error) {
      console.error('Error al agregar la cita:', error);
    }
  }
  
  

  async deleteCita(cita: { frase: string; autor: string }) {
    try {
      if (!this.db) {
        throw new Error('La base de datos no está inicializada.');
      }
  
      const query = `DELETE FROM citas WHERE frase = ? AND autor = ?;`;
      await this.db.run(query, [cita.frase, cita.autor]);
  
      this.citas = this.citas.filter(
        (c) => c.frase !== cita.frase || c.autor !== cita.autor
      );
      console.log('Cita eliminada:', cita);
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
    }
  }
  
  
  async setPermitirEliminar(valor: boolean) {
    this.permitirEliminar = valor;
    await Preferences.set({ key: 'permitirEliminar', value: JSON.stringify(valor) });
  }

  async getPermitirEliminar(): Promise<boolean> {
    try {
      const { value } = await Preferences.get({ key: 'permitirEliminar' });
      this.permitirEliminar = value ? JSON.parse(value) : false;
      return this.permitirEliminar;
    } catch (error) {
      console.error('Error al obtener la configuración de permitir eliminar:', error);
      return false;
    }
  }
}



