package dev.benew.filmbible.domain.dto.video;

import lombok.Data;

@Data
public class VideoThumbDto {

    private Long vtIdx;
    private String videoId;
    private String thumbUrl;
    private String thumbType;
}
