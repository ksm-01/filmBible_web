package dev.benew.filmbible.domain.dto.banner;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BannerDto {
    private Long bannerId;
    private String pcImg;
    private String mobileImg;
    private String link;
    private Boolean show;
    private Integer order;
    private LocalDateTime regDate;
}
