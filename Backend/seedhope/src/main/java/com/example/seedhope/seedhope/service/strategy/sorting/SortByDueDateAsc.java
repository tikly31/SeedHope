package com.example.seedhope.seedhope.service.strategy.sorting;

import com.example.seedhope.seedhope.model.Campaign;
import com.example.seedhope.seedhope.service.strategy.sorting.CampaignSortStrategy;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class SortByDueDateAsc implements CampaignSortStrategy {

    @Override
    public List<Campaign> sort(List<Campaign> campaigns) {
        campaigns.sort(Comparator.comparing(Campaign::getDue_date));
        return campaigns;
    }
}
