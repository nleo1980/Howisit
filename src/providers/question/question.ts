import { Option } from './../../interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the QuestionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class QuestionProvider {

  constructor(public http: HttpClient) {
    // console.log('Hello QuestionProvider Provider');
  }

  getOptions() {
    return this.http.get<Option[]>('assets/data/options.json');
  }

}
