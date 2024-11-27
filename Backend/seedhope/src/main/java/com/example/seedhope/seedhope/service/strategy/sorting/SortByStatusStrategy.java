package com.example.seedhope.seedhope.service.strategy.sorting;

import com.example.seedhope.seedhope.model.Campaign;

import java.util.List;
import java.util.stream.Collectors;

public class SortByStatusStrategy implements CampaignSortStrategy {
    @Override
    public List<Campaign> sort(List<Campaign> campaigns) {
        return campaigns.stream()
                .sorted((c1, c2) -> c1.getStatus().compareTo(c2.getStatus()))
                .collect(Collectors.toList());
    }
}