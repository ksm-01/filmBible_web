package dev.benew.filmbible.domain.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor @AllArgsConstructor
public class ReturnData<T> {
    private Boolean success;
    private Integer code;
    private T data;
    private String message;

    private Boolean refresh; // true일 경우 custom_alert_reload()


    public ReturnData(Boolean success) {
        this.success = success;
    }

    public ReturnData(Boolean success, T data) {
        this.success = success;
        this.data = data;
    }
}
