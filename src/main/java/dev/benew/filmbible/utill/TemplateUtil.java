package dev.benew.filmbible.utill;

import org.springframework.stereotype.Component;
import org.springframework.ui.Model;
import org.thymeleaf.context.Context;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@Component
public class TemplateUtil {
    private final SpringTemplateEngine springTemplateEngine;

    public TemplateUtil(SpringTemplateEngine springTemplateEngine) {
        this.springTemplateEngine = springTemplateEngine;
    }


    public String buildHtml(
            String path, Model model,
            HttpServletRequest request, HttpServletResponse response
    ) {
        WebContext context = new WebContext(request, response, request.getServletContext());

        model.addAttribute("commonUtil", CommonUtil.class);
        Map<String, Object> modelMap = model.asMap();
        context.setVariables(modelMap);

        return springTemplateEngine.process(path, context);
    }


    public String buildHtml(String path, Map<String, Object> modelMap,
                            HttpServletRequest request, HttpServletResponse response) {
        WebContext context = new WebContext(request, response, request.getServletContext());
        if (modelMap == null)
            modelMap = new HashMap<>();
        modelMap.put("commonUtil", CommonUtil.class);
        context.setVariables(modelMap);
        return springTemplateEngine.process(path, context);
    }

    public String buildHtml(String path, Map<String, Object> modelMap) {
        Context context = new Context();
        if (modelMap == null)
            modelMap = new HashMap<>();
        modelMap.put("commonUtil", CommonUtil.class);
        context.setVariables(modelMap);
        return springTemplateEngine.process(path, context);
    }
}
