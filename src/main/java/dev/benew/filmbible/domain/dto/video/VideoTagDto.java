package dev.benew.filmbible.domain.dto.video;

import lombok.Data;

@Data
public class VideoTagDto {
    private String videoId;
    private String tagName;
    private String tagOrder;
}
