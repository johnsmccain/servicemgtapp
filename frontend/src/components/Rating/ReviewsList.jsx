import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Pagination, 
  Card, 
  CardContent,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack
} from '@mui/material';
import ReviewItem from './ReviewItem';
import RatingStars from './RatingStars';
import { useContract } from '@starknet-react/core';
import { CONTRACT_ADDRESSES, RATING_REVIEW_ABI } from '../../utils/contracts';

const PAGE_SIZE = 5; // Number of reviews per page

/**
 * Reviews List Component
 * @param {Object} props - Component props
 * @param {string} props.providerId - ID of the service provider
 */
export default function ReviewsList({ providerId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [weightedRating, setWeightedRating] = useState(0);
  const [filterRating, setFilterRating] = useState(0); // 0 = All ratings

  // Connect to the RatingReview contract
  const { contract } = useContract({
    address: CONTRACT_ADDRESSES.TESTNET.RATING_REVIEW,
    abi: RATING_REVIEW_ABI,
  });

  // Load the provider's rating data
  const loadProviderRating = async () => {
    if (!contract) return;
    
    try {
      // Get average rating and review count
      const ratingData = await contract.call('get_provider_rating', [providerId]);
      setAvgRating(Number(ratingData.avg_rating) / 10); // Convert from contract format (e.g., 45 to 4.5)
      setTotalReviews(Number(ratingData.review_count));
      
      // Get weighted rating
      const weightedData = await contract.call('get_weighted_rating', [providerId]);
      setWeightedRating(Number(weightedData.weighted_rating) / 10);
    } catch (err) {
      console.error('Error loading provider rating:', err);
      setError('Failed to load provider rating data.');
    }
  };

  // Load reviews
  const loadReviews = async () => {
    if (!contract) return;
    
    setLoading(true);
    
    try {
      let reviewIds = [];
      
      // Calculate the offset based on current page
      const offset = (page - 1) * PAGE_SIZE;
      
      if (filterRating > 0) {
        // Filter reviews by rating
        const result = await contract.call('filter_reviews_by_rating', [
          providerId,
          filterRating,
          filterRating,
          offset,
          PAGE_SIZE
        ]);
        reviewIds = Array.from({ length: Number(result.review_ids_len) }, (_, i) => 
          Number(result.review_ids[i])
        );
      } else {
        // Get all reviews with pagination
        const result = await contract.call('get_provider_reviews', [
          providerId,
          offset,
          PAGE_SIZE
        ]);
        reviewIds = Array.from({ length: Number(result.review_ids_len) }, (_, i) => 
          Number(result.review_ids[i])
        );
      }
      
      // Fetch details for each review
      const reviewPromises = reviewIds.map(async (reviewId) => {
        const reviewData = await contract.call('get_review', [providerId, reviewId]);
        return {
          id: reviewId,
          reviewer: reviewData.reviewer,
          serviceId: Number(reviewData.service_id),
          rating: Number(reviewData.rating),
          timestamp: Number(reviewData.timestamp),
          verified: Number(reviewData.verified) === 1,
          content: reviewData.content,
        };
      });
      
      const reviewsData = await Promise.all(reviewPromises);
      setReviews(reviewsData);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts or dependencies change
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
    loadProviderRating();
  }, [contract, providerId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    loadReviews();
  }, [contract, providerId, page, filterRating]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilterRating(Number(event.target.value));
    setPage(1); // Reset to first page when filter changes
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Rating Summary
              </Typography>
              <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                {avgRating.toFixed(1)}
              </Typography>
              <Box sx={{ mb: 1 }}>
                <RatingStars initialValue={avgRating} readOnly showLabel={false} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </Typography>
            </Box>
            
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <Divider sx={{ display: { xs: 'block', md: 'none' } }} />
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Verified Rating
              </Typography>
              <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                {weightedRating.toFixed(1)}
              </Typography>
              <Box sx={{ mb: 1 }}>
                <RatingStars initialValue={weightedRating} readOnly showLabel={false} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Weighted score that prioritizes verified reviews
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Customer Reviews
        </Typography>
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="filter-rating-label">Filter</InputLabel>
          <Select
            labelId="filter-rating-label"
            id="filter-rating"
            value={filterRating}
            onChange={handleFilterChange}
            label="Filter"
          >
            <MenuItem value={0}>All Ratings</MenuItem>
            <MenuItem value={5}>5 Stars</MenuItem>
            <MenuItem value={4}>4 Stars</MenuItem>
            <MenuItem value={3}>3 Stars</MenuItem>
            <MenuItem value={2}>2 Stars</MenuItem>
            <MenuItem value={1}>1 Star</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      ) : reviews.length === 0 ? (
        <Typography variant="body1" sx={{ my: 4, textAlign: 'center' }}>
          No reviews yet. Be the first to write a review!
        </Typography>
      ) : (
        <>
          <Stack spacing={2}>
            {reviews.map((review) => (
              <ReviewItem
                key={review.id}
                reviewer={review.reviewer}
                rating={review.rating}
                content={review.content}
                timestamp={review.timestamp}
                verified={review.verified}
              />
            ))}
          </Stack>
          
          {totalReviews > PAGE_SIZE && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(totalReviews / PAGE_SIZE)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
} 