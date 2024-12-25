package com.example.seedhope.seedhope.repository;

import com.example.seedhope.seedhope.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {

    List<Campaign> findByStatus(Campaign.Status status);

    List<Campaign> findByCategoryAndStatus(String category, Campaign.Status status);

    // Find campaigns sorted by due date (ascending order)
    List<Campaign> findByOrderByDueDateAsc();

    // Find campaigns sorted by creation date (descending order)
    List<Campaign> findByOrderByCreationDateDesc();

    // Find campaigns by status and sort by due date
    List<Campaign> findByStatusOrderByDueDateAsc(Campaign.Status status);

    // Custom Query: Find campaigns by category and status, sorted by due date
    @Query("SELECT c FROM Campaign c WHERE c.category = :category AND c.status = :status ORDER BY c.dueDate ASC")
    List<Campaign> findByCategoryAndStatusOrderByDueDate(@Param("category") String category, @Param("status") Campaign.Status status);

    @Query("SELECT c FROM Campaign c WHERE c.category = :category AND " +
            "(LOWER(c.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Campaign> searchCampaignsByCategoryAndKeyword(@Param("category") String category,
                                                       @Param("searchTerm") String searchTerm);
}
