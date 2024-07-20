import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContatosdetailsComponent } from './contatosdetails.component';

describe('ContatosdetailsComponent', () => {
  let component: ContatosdetailsComponent;
  let fixture: ComponentFixture<ContatosdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContatosdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContatosdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
