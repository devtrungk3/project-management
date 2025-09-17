package com.example.server.model.dto.admin;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Setter
@Getter
@NoArgsConstructor
public class UserStatisticsDTO {
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private long userGrowthCount;
    private double userGrowthRate;
    public UserStatisticsDTO(Long totalUsers, Long activeUsers, Long inactiveUsers) {
        this.totalUsers = totalUsers != null ? totalUsers : 0L;
        this.activeUsers = activeUsers != null ? activeUsers : 0L;
        this.inactiveUsers = inactiveUsers != null ? inactiveUsers : 0L;
    }
    public void setUserGrowthCount(Long userGrowthCount) {
        this.userGrowthCount = userGrowthCount != null ? userGrowthCount : 0L;
    }
    public void setUserGrowthRate(Double userGrowthRate) {
        this.userGrowthRate = userGrowthRate != null ? userGrowthRate : 0.0;
    }
    public double getUserGrowthRate() {
        BigDecimal bigDecimal = new BigDecimal(String.valueOf(this.userGrowthRate)).setScale(2, RoundingMode.HALF_UP);
        return bigDecimal.doubleValue();
    }
}
