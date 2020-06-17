import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GithubApi } from './github-issue';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor(private http: HttpClient) { }

  getRepoIssues(sort: string, order: string, page: number): Observable<GithubApi> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl =
      `${href}?q=fsd-SBA&sort=${sort}&order=${order}`;
      //&page=${page + 1}

    return this.http.get<GithubApi>(requestUrl);
  }
}
