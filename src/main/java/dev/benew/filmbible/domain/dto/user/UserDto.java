package dev.benew.filmbible.domain.dto.user;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long idx;
    private String userId;
    private String userPwd;
    private String userName;
    private LocalDateTime regDate;
}
