package dev.benew.filmbible.config.advice;


import dev.benew.filmbible.utill.CommonUtil;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Objects;

@Slf4j
@ControllerAdvice
public class DefaultModelAdvice {
    public DefaultModelAdvice() {
    }

    @ModelAttribute
    public void basicSetting(
            HttpServletRequest request, HttpServletResponse response,
            Model model
    ) {
        String requestUri = request.getRequestURI();
        if (Objects.equals("/error", requestUri))
            return;

        String pathUrl = "";
        String finalUrl = "";
        String[] requestUriSplit = requestUri.split("/");

        if (requestUriSplit.length > 0) {
            finalUrl = requestUriSplit[requestUriSplit.length-1];
            try {
                pathUrl = requestUriSplit[requestUriSplit.length-2];
            } catch (Exception ignore) {}
            try {
                Integer.parseInt(finalUrl);
                finalUrl = requestUriSplit[requestUriSplit.length-2];
                pathUrl = requestUriSplit[requestUriSplit.length-3];
            } catch (Exception ignore) {}
        }

        model.addAttribute("contextPath", request.getContextPath());
        model.addAttribute("pathUrl", pathUrl);
        model.addAttribute("finalUrl", finalUrl);
        model.addAttribute("commonUtil", CommonUtil.class);
    }
}
