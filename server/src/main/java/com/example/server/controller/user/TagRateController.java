package com.example.server.controller.user;

import com.example.server.model.entity.TagRate;
import com.example.server.service.domain.tagRate.TagRateService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user/projects/{projectId}/tag-rates")
@RequiredArgsConstructor
public class TagRateController {
    private final TagRateService tagRateService;
    @GetMapping
    public ResponseEntity<List<TagRate>> getAllTagRates(@PathVariable(name = "projectId") int projectId, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        return ResponseEntity.ok(tagRateService.getTagRatesByProjectAndOwner(projectId, userIdExtractedFromJWT));
    }
    @PostMapping
    public ResponseEntity<TagRate> addTagRate(@RequestBody TagRate newTagRate, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        TagRate savedTagRate = tagRateService.addTagRate(newTagRate, userIdExtractedFromJWT);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTagRate);
    }
    @PutMapping
    public ResponseEntity<TagRate> updateTagRate(@RequestBody TagRate updatedTagRate, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        TagRate savedTagRate = tagRateService.updateTagRate(updatedTagRate, userIdExtractedFromJWT);
        return ResponseEntity.ok(savedTagRate);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTagRate(@PathVariable(name = "id") int tagRateId, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        tagRateService.deleteTagRate(tagRateId, userIdExtractedFromJWT);
        return ResponseEntity.noContent().build();
    }
}
