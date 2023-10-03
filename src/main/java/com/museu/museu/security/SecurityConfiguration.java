package com.museu.museu.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf((csrf) -> csrf.disable())
                .authorizeHttpRequests(request -> request.requestMatchers(HttpMethod.POST, "/login").permitAll()
                // .requestMatchers("/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.POST, "/viagenspesquisa/cadastrar/**").hasAnyAuthority("PESQUISADOR", "ADMIN", "GERENTE").requestMatchers(HttpMethod.GET, "/viagenspesquisa/**").hasAuthority("PESQUISADOR")
                .requestMatchers(HttpMethod.PUT, "/viagenspesquisa/aprovar").hasAnyAuthority("ADMIN", "GERENTE")
                .requestMatchers("/pecas**").hasAnyAuthority("ADMIN", "GERENTE", "PESQUISADOR")
                .requestMatchers("/funcionarios**").hasAnyAuthority("ADMIN", "GERENTE")
                .anyRequest().authenticated())
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public void configure(AuthenticationManagerBuilder builder) throws Exception {
        builder.inMemoryAuthentication()
        .withUser("ADMIN").password(passwordEncoder().encode("123456")).authorities("ADMIN");
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
