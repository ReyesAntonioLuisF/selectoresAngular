import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pipe, switchMap, tap } from 'rxjs';
import { PaisSmall } from '../../interfaces/pais.interface';
import { PaisesServiceService } from '../../services/paises-service.service';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html'
})
export class SelectorPagesComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  })

  // llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall [] = [];

  cargando: boolean = false;

  constructor(private fb: FormBuilder,
              private paisesService: PaisesServiceService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(( _ ) => {
          this.paises = [];
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        } ),
        switchMap(region => this.paisesService.getPaisesPorRegion( region))
      )
      .subscribe( paises => {
        this.paises = paises
        this.cargando=false;
      })

    this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap( ( _ ) => { 
            this.fronteras = [];
            this.miFormulario.get('frontera')?.reset('')
            this.cargando = true;
          }),
          switchMap(paisCode => this.paisesService.getPaisPorCode(paisCode)),
          switchMap( pais => this.paisesService.getPaisesPorCodigo(pais?.borders!))
        )
        .subscribe(paises => {
          this.fronteras = paises;
          this.cargando=false;
        })
    // cuando cambie la region
    /*this.miFormulario.get('region')?.valueChanges
      .subscribe( region =>{
        this.paisesService.getPaisesPorRegion( region)
          .subscribe( paises => {
            console.log(paises)
            this.paises = paises
          })
      })*/
  }

  guardar(){
    console.log(this.miFormulario.value)
  }
}
