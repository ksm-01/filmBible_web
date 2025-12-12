package dev.benew.filmbible.mapper;

import dev.benew.filmbible.domain.dto.user.UserDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    UserDto findUserByIdx(
            @Param("userIdx") Long userIdx
    );

    UserDto findUserById(
            @Param("userId") String userId
    );
}
