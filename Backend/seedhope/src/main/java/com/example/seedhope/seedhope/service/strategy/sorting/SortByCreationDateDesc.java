package com.example.seedhope.seedhope.service.strategy.sorting;

import com.example.seedhope.seedhope.model.Campaign;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class SortByCreationDateDesc implements CampaignSortStrategy {

    @Override
    public List<Campaign> sort(List<Campaign> campaigns) {
        campaigns.sort(Comparator.comparing(Campaign::getCreatedAt).reversed());
        return campaigns;
    }
}
