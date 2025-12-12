package dev.benew.filmbible.domain.common;

import dev.benew.filmbible.domain.dto.user.UserDto;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.Collections;


@Slf4j
@Getter
public class UserInfo extends User {
    private UserDto user;

    public UserInfo(String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
    }

    public UserInfo(String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
    }

    public UserInfo(
            UserDto userDto
    ) {
        super(
                userDto.getIdx().toString(),
                userDto.getUserPwd(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
        this.user = userDto;
    }

}
