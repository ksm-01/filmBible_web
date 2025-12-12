package dev.benew.filmbible.config.handler;

import dev.benew.filmbible.domain.common.UserInfo;
import dev.benew.filmbible.domain.dto.user.UserDto;
import dev.benew.filmbible.service.UserService;
import dev.benew.filmbible.utill.CommonUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AuthenticationProviderImpl implements AuthenticationProvider {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationProviderImpl(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (!(authentication.getPrincipal() instanceof String)) {
            log.warn("authentication.getPrincipal() - it's not string");
            throw new BadCredentialsException(CommonUtil.base64Encode("authentication.getPrincipal() - it's not string"));
        }
        if (!(authentication.getCredentials() instanceof String)) {
            log.warn("authentication.getCredentials() - it's not string");
            throw new BadCredentialsException(CommonUtil.base64Encode("authentication.getCredentials() - it's not string"));
        }


        String id = authentication.getPrincipal().toString();
        String pwd = authentication.getCredentials().toString();
        log.info("gggg -   id:{}  pwd:{}", id, pwd);

        UserDto userDto = userService.findUserById(id);

        if (userDto == null) {
            log.warn("   아이디 틀림");
            throw new BadCredentialsException(CommonUtil.base64Encode(
                    "아이디 또는 패스워드가 일치하지 않습니다."
            ));
        }

        if (!passwordEncoder.matches(pwd, userDto.getUserPwd())) {
            log.warn("   비밀번호 틀림");
            throw new BadCredentialsException(CommonUtil.base64Encode(
                    "아이디 또는 패스워드가 일치하지 않습니다."
            ));
        }

        UserInfo memberInfo = new UserInfo(userDto);

        return new UsernamePasswordAuthenticationToken(
                memberInfo,
                authentication.getCredentials(),
                memberInfo.getAuthorities()
        );
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return true;
    }

}
