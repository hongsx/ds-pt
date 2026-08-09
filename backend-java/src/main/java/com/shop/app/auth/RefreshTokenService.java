package com.shop.app.auth;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.shop.app.users.entity.User;
import com.shop.app.users.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenMapper refreshTokenMapper;

    @Autowired
    private UserMapper userMapper;

    // create and persist a refresh token for a user
    public String createRefreshToken(Integer userId, long expireSeconds) {
        // remove old tokens for the user (simple rotation)
        refreshTokenMapper.deleteByUserId(userId);
        String token = UUID.randomUUID().toString() + UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now(ZoneId.of("UTC")).plusSeconds(expireSeconds);
        RefreshToken rt = new RefreshToken();
        rt.setToken(token);
        rt.setUserId(userId);
        rt.setExpiresAt(expiresAt);
        refreshTokenMapper.insert(rt);
        return token;
    }

    public Integer validateRefreshToken(String token) {
        if (token == null) return null;
        RefreshToken rt = refreshTokenMapper.findByToken(token);
        if (rt == null) return null;
        if (rt.getExpiresAt().isBefore(LocalDateTime.now(ZoneId.of("UTC")))) {
            // expired; delete
            refreshTokenMapper.deleteById(rt.getId());
            return null;
        }
        return rt.getUserId();
    }

    public void revokeToken(String token) {
        if (token == null) return;
        refreshTokenMapper.deleteByToken(token);
    }
}
