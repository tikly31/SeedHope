package com.example.seedhope.seedhope.util;

import com.example.seedhope.seedhope.model.Campaign;
import com.example.seedhope.seedhope.service.strategy.sorting.CampaignSortStrategy;

import java.util.List;

public class CampaignSorter {
    private CampaignSortStrategy sortStrategy;

    // Set the sorting strategy dynamically
    public void setSortStrategy(CampaignSortStrategy sortStrategy) {
        this.sortStrategy = sortStrategy;
    }

    // Use the current strategy to sort the campaigns
    public List<Campaign> sortCampaigns(List<Campaign> campaigns) {
        if (sortStrategy == null) {
            throw new IllegalStateException("Sort strategy not set!");
        }
        return sortStrategy.sort(campaigns);
    }
}

