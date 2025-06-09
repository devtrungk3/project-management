package com.example.server.models;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
public class JoinRequestPK {
    private int userId;
    private int projectId;

    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (!(obj instanceof JoinRequestPK)) return false;
        JoinRequestPK o = (JoinRequestPK) obj;
        return Objects.equals(userId, o.userId) && Objects.equals(projectId, o.projectId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, projectId);
    }
}
