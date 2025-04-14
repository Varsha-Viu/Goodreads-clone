import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTerm = new BehaviorSubject<string>('');
  currentSearch = this.searchTerm.asObservable();
  
  constructor() { }

  setSearch(term: string) {
    this.searchTerm.next(term);
  }
}
