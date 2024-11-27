package com.example.seedhope.seedhope.service.strategy.sorting;

import com.example.seedhope.seedhope.model.Campaign;

import java.util.List;

public interface CampaignSortStrategy {
    List<Campaign> sort(List<Campaign> campaigns);
}
