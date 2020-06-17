import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { IssueService } from '../issue.service';
import { MatTableDataSource } from '@angular/material/table';
import { GithubIssue } from '../github-issue';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { IssueDialogComponent } from './issue-dialog/issue-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements AfterViewInit {

  title = 'Github 中 Angular 问题列表'
  isLoadingResults = true; // 表示是否加载完成，等于真时，显示加载进度
  isRateLimitReached = false; // 表示接口是否异常，等于假时，表示无异常

  // 使用管道显示对应的文字
  dicMap: any = { 'open': '打开', 'closed': '关闭' };
  // 定义表格接受的数据源
  dataSource: MatTableDataSource<GithubIssue>;

  constructor(private issueService: IssueService, public dialog: MatDialog) { }

  // 对应页面上的分页和排序组件
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngAfterViewInit() {
    // 如果用户改变了排序顺序，则重置回第一页。
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true; // 表示显示加载进度
          return this.issueService.getRepoIssues(
            this.sort.active, this.sort.direction, this.paginator.pageIndex);
        }),
        map(data => {
          this.isLoadingResults = false; // 表示隐藏加载进度，数据加载完成
          this.isRateLimitReached = false; // 表示无异常
          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false; // 表示隐藏加载进度
          // GitHub API 接口有时候会限制访问次数
          this.isRateLimitReached = true; // 表示无异常
          return of([]);
        })
      ).subscribe(data => {
        this.dataSource = new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  // 点击行操作时，触发的方法
  onRowClicked(row) {
    console.log('点击行操作: ', row);
  }

  // 统计留言数
  getTotalComments() {
//     console.log('pageIndex: ', this.paginator.pageIndex);
//     console.log('this.dataSource?.data: ', this.dataSource?.data);
    let value = 0;
    for (let index in this.dataSource?.data) {
      if (Number(index) >= this.paginator.pageIndex*5 && Number(index) <= this.paginator.pageIndex*5+4) {
//         console.log(index, ': ', Number(this.dataSource?.data[index].comments));
        value += Number(this.dataSource?.data[index].comments);
      }
    }
//     console.log('value: ', value);
    return value;
//     return this.dataSource?.data.map(t => +t.comments).reduce((acc, value) => acc + value, 0);
  }

  // 过滤数据
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // 当过滤数据后，页数发生变化时，跳转到第一页
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  menuColumns = [
    { id: 'number', hide: true },
    { id: 'created', hide: true },
    { id: 'state', hide: true },
    { id: 'title', hide: true },
    { id: 'comments', hide: true },
    { id: 'menu', hide: true }
  ]

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.menuColumns, event.previousIndex, event.currentIndex);
  }

  // 定义显示表格的列
  displayedColumns: string[] = ['number', 'created', 'state', 'title', 'comments', 'menu'];

  getMenuColumns(): string[] {
    return this.menuColumns.filter(item => item.hide).map(item => item.id);
  }

  hideColumns(event: MatCheckboxChange) {
    const colName = event.source.name;
    const checked = event.checked;
    console.log(colName, checked);

    let index = this.menuColumns
      .map(item => item.id)
      .indexOf(colName);
    this.menuColumns[index].hide = checked;
  }

  //打开对话框
  openDialog(githubIssue: GithubIssue): void {
    const dialogRef = this.dialog.open(IssueDialogComponent, {
      width: '300px',
      data: githubIssue
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
