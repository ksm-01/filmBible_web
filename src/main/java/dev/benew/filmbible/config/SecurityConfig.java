package dev.benew.filmbible.config;

import dev.benew.filmbible.utill.CommonUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.http.HttpServletResponse;


@Configuration
public class SecurityConfig {

    private final AuthenticationProvider authenticationProvider;
    private final AuthenticationSuccessHandler authenticationSuccessHandler;
    private final AuthenticationFailureHandler authenticationFailureHandler;
    private final UserDetailsService userDetailsService;


    public SecurityConfig(AuthenticationProvider authenticationProvider, AuthenticationSuccessHandler authenticationSuccessHandler, AuthenticationFailureHandler authenticationFailureHandler, UserDetailsService userDetailsService) {
        this.authenticationProvider = authenticationProvider;
        this.authenticationSuccessHandler = authenticationSuccessHandler;
        this.authenticationFailureHandler = authenticationFailureHandler;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

      return http
              .authenticationProvider(authenticationProvider)
              .antMatcher("/**")
              .authorizeHttpRequests(authorize -> authorize
                      .antMatchers("/css/**", "/js/**", "/img/**", "/alert/**").permitAll()
                      .anyRequest().permitAll()
              )
              .formLogin(form -> form
                      .loginPage("/login")
                      .usernameParameter("id")
                      .passwordParameter("pwd")
                      .loginProcessingUrl("/auth")
                      .successHandler(authenticationSuccessHandler)
                      .failureHandler(authenticationFailureHandler)
              )
              .logout(logout -> logout
                      .invalidateHttpSession(true)
                      .deleteCookies("JSESSIONID")
                      .logoutUrl("/logout")
                      .logoutSuccessUrl("/?success=" + CommonUtil.base64Encode("로그아웃 되었습니다."))
              )
              .rememberMe(re -> re
                      .rememberMeCookieName("remember-me-filmBible")
                      .rememberMeParameter("remember")
                      .userDetailsService(userDetailsService)
                      .tokenValiditySeconds(60*60*24*7) // 7일
              )
              .exceptionHandling(ex -> ex
                      .authenticationEntryPoint((request, response, authException) -> {
                          if ("XMLHttpRequest".equals(request.getHeader("X-Requested-With"))) {

                              response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                              response.setContentType("application/json;charset=UTF-8");
                              response.getWriter().write("{\"error\": \"Unauthorized\"}");
                          } else
                              response.sendRedirect("/login");
                      })
                      .accessDeniedHandler((request, response, authException) -> {
                          if ("XMLHttpRequest".equals(request.getHeader("X-Requested-With"))) {

                              response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
                              response.setContentType("application/json;charset=UTF-8");
                              response.getWriter().write("{\"error\": \"FORBIDDEN\"}");
                          } else
                              response.sendRedirect("/login");
                      })
              )
              .headers(headers -> headers
                      .frameOptions().disable()
                      .contentSecurityPolicy(csp -> csp
                              .policyDirectives(
                                      "frame-ancestors 'self' http://localhost:20005 https://admin.xn--vo5b23idue.com"
                              )
                      )
              )
              .csrf().disable()
              .cors().disable()
              .build();
  }

}
