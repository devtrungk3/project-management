package com.example.server.controller.admin;

import com.example.server.model.entity.Currency;
import com.example.server.service.domain.currency.CurrencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("CurrencyControllerForAdmin")
@RequiredArgsConstructor
@RequestMapping("api/v1/admin/currencies")
public class CurrencyController {
    private final CurrencyService currencyService;
    @GetMapping
    public ResponseEntity<List<Currency>> getAllCurrenciesForAdmin() {
        return ResponseEntity.ok(currencyService.getAllCurrenciesOrderById());
    }
    @PostMapping
    public ResponseEntity<Currency> addCurrency(@RequestBody Currency newCurrency) {
        return ResponseEntity.status(HttpStatus.CREATED).body(currencyService.addCurrency(newCurrency));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCurrency(@PathVariable(name = "id") int deletedCurrencyId) {
        currencyService.deleteCurrencyById(deletedCurrencyId);
        return ResponseEntity.noContent().build();
    }
    @PutMapping
    public ResponseEntity<Currency> updateCurrency(@RequestBody Currency updatedCurrency) {
        return ResponseEntity.ok(currencyService.updateCurrency(updatedCurrency));
    }
}
