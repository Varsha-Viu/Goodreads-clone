import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookslistingComponent } from './bookslisting.component';

describe('BookslistingComponent', () => {
  let component: BookslistingComponent;
  let fixture: ComponentFixture<BookslistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookslistingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookslistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
