package com.shop.app.auth;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("refresh_tokens")
public class RefreshToken {
    @TableId
    private Long id;
    private String token;
    private Integer userId;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
