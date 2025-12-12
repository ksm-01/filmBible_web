package dev.benew.filmbible.config.interceptor;

import dev.benew.filmbible.domain.common.UserInfo;
import dev.benew.filmbible.domain.dto.user.UserDto;
import dev.benew.filmbible.utill.IpUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.core.MethodParameter;
import org.springframework.security.authentication.RememberMeAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.Map;



@Slf4j
@Component
public class LogInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod))
            return HandlerInterceptor.super.preHandle(request, response, handler);

        String uri = request.getRequestURI();
        if (uri.startsWith("/error"))
            return HandlerInterceptor.super.preHandle(request, response, handler);

        Principal principal = request.getUserPrincipal();
        Long userIdx = null;
        String userId = null;
        String ip = IpUtil.getRemoteIP(request);
        if (principal instanceof UsernamePasswordAuthenticationToken authToken) {
            UserInfo userInfo = (UserInfo) authToken.getPrincipal();
            UserDto userDto = userInfo.getUser();
            userIdx = userDto.getIdx();
            userId = userDto.getUserId();
        } else if (principal instanceof RememberMeAuthenticationToken authToken) {
            UserInfo userInfo = (UserInfo) authToken.getPrincipal();
            UserDto userDto = userInfo.getUser();
            userIdx = userDto.getIdx();
            userId = userDto.getUserId();
        }

        log.info("");
        log.info("\uD83D\uDCE1\uD83C\uDF10 WEB LOG START 🌐\uD83D\uDCE1");
        log.info("|  \uD83D\uDD17uri:{}", uri);
        log.info("|    userIdx:{}  userId:{}  ip:{}", userIdx, userId, ip);


        Map<String, String[]> parameters = request.getParameterMap();
        MethodParameter[] methodParameters = handlerMethod.getMethodParameters();
        String pathVariable = null;
        if (ArrayUtils.isNotEmpty(methodParameters)) {
            for (MethodParameter param : methodParameters) {
                if (param.hasParameterAnnotation(PathVariable.class)) {
                    log.info("|      ㄴ path parameter");
                    try {
                        String[] pathUri = uri.replaceAll(request.getContextPath(), "").split("/");
                        pathVariable = pathUri[pathUri.length - 1];
                        log.info("|         {}:{}", "pathVariable", pathVariable);
                    } catch (Exception ignore) {}
                } else if (param.hasParameterAnnotation(RequestBody.class)) {
                    log.info("|      ㄴ body parameter");
                }
            }
        }
        if (parameters != null && !parameters.isEmpty()) {
            log.info("|      ㄴ parameters");
            parameters.forEach((key, value) -> {
                if (key != null && !key.equals("_") && !key.equals("contentJson"))
                    log.info("|         {}:{}", key, value);
            });
        }

        log.info("\uD83C\uDFC1 WEB LOG END =====================");

        return HandlerInterceptor.super.preHandle(request, response, handler);
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }
}
