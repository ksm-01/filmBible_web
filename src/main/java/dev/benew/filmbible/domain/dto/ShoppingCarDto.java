package dev.benew.filmbible.domain.dto;

import lombok.Data;

@Data
public class ShoppingCarDto {
    private Long shoppingIdx;
    private Long userIdx;
    private Long productIdx;

}
