import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
    constructor() {
        super();
        this.getAndInitTranslations();
    }

    getAndInitTranslations() {
        this.itemsPerPageLabel = "每页显示"; // 翻页组件前面的提示信息
        this.nextPageLabel = "下一页"; // 鼠标悬停在图标上显示
        this.previousPageLabel = "上一页"; // 鼠标悬停在图标上显示
        this.changes.next();
    }

    getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return `0 / ${length}`; // 记录为空时
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} / ${length}`; // 这里替换原先的提示信息
    }
}
