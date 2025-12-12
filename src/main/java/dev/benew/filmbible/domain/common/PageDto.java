package dev.benew.filmbible.domain.common;

import lombok.Data;

@Data
public class PageDto {
    private Integer start_page;
    private Integer end_page;
    private Integer last_page;
    private Integer current_page;
    private Integer prev_page = 1; // 이전 페이지 (start_page가 1이면 1)
    private Integer next_page; // 다음 페이지
    private Integer count;
    private Integer range;
    private Integer size;

    private Integer first_item_index;
    private Integer last_item_index;

    public PageDto(Integer page, Integer size, Integer range, Integer count) {
        this.current_page = page;
        this.count = count;
        this.range = range;
        this.size = size;
        if (count == 0)
            this.last_page = 1;
        else {
            if (count%size == 0)
                this.last_page = count/size;
            else
                this.last_page = count/size+1;
        }

        this.end_page = ((page-1)/range + 1) * range;
        this.start_page = this.end_page - range + 1;
        if (this.last_page <= this.end_page) {
            this.end_page = this.last_page;
            this.next_page = this.last_page;
        } else {
            this.next_page = this.end_page+1;
        }

        if (this.start_page > 1)
            this.prev_page = start_page - 1;

        first_item_index = size * (page-1) + 1;
        last_item_index = size * page;
        if(last_item_index > count)
            last_item_index = count;
        if(count == 0)
            first_item_index = 0;

    }
}
