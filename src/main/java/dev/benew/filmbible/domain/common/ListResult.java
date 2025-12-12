package dev.benew.filmbible.domain.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor @AllArgsConstructor
public class ListResult<T> {
    private List<T> list;
    private Integer count;
    private Boolean isEnd;

    public ListResult(List<T> list, Integer count) {
        this.list = list;
        this.count = count;
    }
}
