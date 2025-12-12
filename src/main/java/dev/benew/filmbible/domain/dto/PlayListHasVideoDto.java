package dev.benew.filmbible.domain.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PlayListHasVideoDto {
    private Long phvIdx;
    private String playListId;
    private String videoId;
    private LocalDateTime regDate;
}
