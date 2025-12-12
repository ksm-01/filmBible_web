package dev.benew.filmbible.domain.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChannelDto {
    private String channelId;
    private String channelName;
    private Long channelSubscriber;

    private LocalDateTime createdDate;
    private LocalDateTime channelRegDate;
    private LocalDateTime refreshDate;
}
