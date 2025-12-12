package dev.benew.filmbible.service;

import dev.benew.filmbible.domain.dto.user.UserDto;
import dev.benew.filmbible.mapper.UserMapper;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserMapper userMapper;

    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }


    public UserDto findUserByIdx(Long userIdx) {
        return userMapper.findUserByIdx(userIdx);
    }

    public UserDto findUserById(String userId) {
        return userMapper.findUserById(userId);
    }
}
