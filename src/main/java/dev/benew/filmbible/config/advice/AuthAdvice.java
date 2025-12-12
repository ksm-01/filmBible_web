package dev.benew.filmbible.config.advice;

import dev.benew.filmbible.domain.common.UserInfo;
import dev.benew.filmbible.domain.dto.user.UserDto;
import dev.benew.filmbible.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.RememberMeAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;

@Slf4j
@ControllerAdvice
public class AuthAdvice {

    @Autowired
    private UserService userService;

    @ModelAttribute
    public void authSetup(
            HttpServletRequest request, HttpServletResponse response,
            Model model
    )   {
        // 임시 로그인
//        SessionUtil.setMemberInfo(memberService.findMemberByIdx(2L));

        Principal principal = request.getUserPrincipal();
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            UsernamePasswordAuthenticationToken authToken = (UsernamePasswordAuthenticationToken) principal;
            UserInfo memberInfo = (UserInfo) authToken.getPrincipal();
            UserDto userDto = memberInfo.getUser();
            model.addAttribute("userDto", userDto);
            model.addAttribute("myIdx", userDto.getIdx());
//            model.addAttribute("myRole", memberDto.getRole().toString());
            model.addAttribute("authenticated", true);
        } else if (principal instanceof RememberMeAuthenticationToken) {
            RememberMeAuthenticationToken authToken = (RememberMeAuthenticationToken) principal;
            UserInfo userInfo = (UserInfo) authToken.getPrincipal();
            UserDto userDto = userInfo.getUser();
            model.addAttribute("userDto", userDto);
            model.addAttribute("myIdx", userDto.getIdx());
//            model.addAttribute("myRole", memberDto.getRole().toString());
            model.addAttribute("authenticated", true);
        } else {
            model.addAttribute("authenticated", false);
        }
    }
}
