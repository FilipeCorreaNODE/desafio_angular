import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContatoslistComponent } from './contatoslist.component';

describe('ContatoslistComponent', () => {
  let component: ContatoslistComponent;
  let fixture: ComponentFixture<ContatoslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContatoslistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContatoslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
