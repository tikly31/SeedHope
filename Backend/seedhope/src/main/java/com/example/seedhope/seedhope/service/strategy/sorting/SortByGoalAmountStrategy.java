package com.example.seedhope.seedhope.service.strategy.sorting;

import com.example.seedhope.seedhope.model.Campaign;

import java.util.List;
import java.util.stream.Collectors;

public class SortByGoalAmountStrategy implements CampaignSortStrategy {
    @Override
    public List<Campaign> sort(List<Campaign> campaigns) {
        return campaigns.stream()
                .sorted((c1, c2) -> Double.compare(c1.getGoalAmount(), c2.getGoalAmount()))
                .collect(Collectors.toList());
    }
}
