package dev.benew.filmbible.service.auth;

import dev.benew.filmbible.domain.common.UserInfo;
import dev.benew.filmbible.domain.dto.user.UserDto;
import dev.benew.filmbible.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserService userService;

    public UserDetailsServiceImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Long idxL = null;
        try {
            idxL = Long.parseLong(username);
        } catch (Exception ignored) {}
        UserDto userDto = userService.findUserByIdx(idxL);
        if (userDto == null)
            return null;

        return new UserInfo(userDto);
    }
}
