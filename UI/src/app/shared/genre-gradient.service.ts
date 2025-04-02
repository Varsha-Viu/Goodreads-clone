import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenreGradientService {

  constructor() { }

  private genreGradients: { [key: string]: string } = {
    "Art": "linear-gradient(to right, #FFB6C1, #8A2BE2)",
    "Biography": "linear-gradient(to right, #F4A261, #E76F51)",
    "Business": "linear-gradient(to right, #14213D, #FCA311)",
    "Children's": "linear-gradient(to right, #FFB703, #FB8500)",
    "Christian": "linear-gradient(to right, #6A0572, #D883FF)",
    "Classics": "linear-gradient(to right, #8C7853, #F5DEB3)",
    "Comics": "linear-gradient(to right, #FF0000, #FFD700)",
    "Cookbooks": "linear-gradient(to right, #F28482, #FFDD95)",
    "Ebooks": "linear-gradient(to right, #0F2027, #2C5364)",
    "Fantasy": "linear-gradient(to right, #6A0572, #3498DB)",
    "Fiction": "linear-gradient(to right, #D1C4E9, #B39DDB)",
    "Graphic Novels": "linear-gradient(to right, #FF6F61, #6A0572)",
    "Historical Fiction": "linear-gradient(to right, #8E8D8A, #D9B08C)",
    "History": "linear-gradient(to right, #B08968, #6C584C)",
    "Horror": "linear-gradient(to right, #000000, #8B0000)",
    "Memoir": "linear-gradient(to right, #F4A261, #2A9D8F)",
    "Music": "linear-gradient(to right, #FF6B6B, #1A535C)",
    "Mystery": "linear-gradient(to right, #2C3E50, #4CA1AF)",
    "Nonfiction": "linear-gradient(to right, #2C5364, #0F2027)",
    "Poetry": "linear-gradient(to right, #F2E9E4, #C9ADA7)",
    "Psychology": "linear-gradient(to right, #2193B0, #6DD5ED)",
    "Romance": "linear-gradient(to right, #FF6F91, #FF9671)",
    "Science": "linear-gradient(to right, #004E92, #000428)",
    "Science Fiction": "linear-gradient(to right, #0F2027, #2C5364)",
    "Self Help": "linear-gradient(to right, #43C6AC, #191654)",
    "Sports": "linear-gradient(to right, #F4A261, #E63946)",
    "Thriller": "linear-gradient(to right, #000000, #434343)",
    "Travel": "linear-gradient(to right, #56CCF2, #2F80ED)",
    "Young Adult": "linear-gradient(to right, #FF9A9E, #FFDDE1)"
  };

  getGradient(genre: string): string {
    return this.genreGradients[genre] || "linear-gradient(to right, #ffffff, #cccccc)"; // Default gradient
  }
}
