import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialRoutingModule } from './material-routing.module';
import { MaterialComponent } from './material.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { IssueDialogComponent } from './issue-dialog/issue-dialog.component';
import { CustomMatPaginatorIntl } from './custom-mat-paginator-intl';

@NgModule({
  declarations: [MaterialComponent, IssueDialogComponent],
  imports: [
    CommonModule,
    MaterialRoutingModule,
    MatToolbarModule, // 工具栏
    MatIconModule, // 图标
    MatTableModule,// 表格
    MatPaginatorModule, // 表格的分页
    MatSortModule,// 表格的排序
    MatProgressSpinnerModule, // 显示进度
    MatInputModule, // 输入框
    MatMenuModule, // 菜单
    MatCheckboxModule, // 复选框
    DragDropModule, // 拖拽
    MatDialogModule, // 对话框
    MatRadioModule, // 单选框
    FormsModule // 表单
  ],
  providers: [{
    provide: MatPaginatorIntl, // 注册CustomMatPaginatorIntl实例
    useClass: CustomMatPaginatorIntl
  }]
})
export class MaterialModule { }
