import { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Card, 
  CardContent,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import RatingStars from './RatingStars';
import { useContract, useAccount } from '@starknet-react/core';
import { CONTRACT_ADDRESSES, RATING_REVIEW_ABI } from '../../utils/contracts';

/**
 * Submit Review Component
 * @param {Object} props - Component props
 * @param {string} props.providerId - ID of the service provider
 * @param {string} props.serviceId - ID of the service
 * @param {Function} props.onReviewSubmitted - Callback when a review is submitted
 */
export default function SubmitReview({ providerId, serviceId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const { account } = useAccount();
  
  // Connect to the RatingReview contract
  const { contract } = useContract({
    address: CONTRACT_ADDRESSES.TESTNET.RATING_REVIEW,
    abi: RATING_REVIEW_ABI,
  });

  // Check if user has already reviewed this service
  const checkHasReviewed = async () => {
    if (!account || !contract) return;
    
    try {
      const result = await contract.call('check_has_reviewed', [
        account.address,
        serviceId
      ]);
      
      setHasReviewed(Number(result.has_reviewed) === 1);
    } catch (err) {
      console.error('Error checking review status:', err);
    }
  };

  // Call checkHasReviewed when component mounts or dependencies change
  useState(() => {
    checkHasReviewed();
  }, [account, contract, serviceId]);

  const handleRatingChange = (newValue) => {
    setRating(newValue);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!rating) {
      setError('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please write a review');
      return;
    }
    
    if (!account || !contract) {
      setError('Please connect your wallet');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Convert rating to contract format (e.g., 4.5 becomes 45)
      const contractRating = Math.round(rating * 10) / 10;
      
      // Submit the review to the contract
      const response = await contract.invoke('submit_review', [
        providerId,
        serviceId,
        contractRating,
        comment
      ]);
      
      console.log('Review submitted:', response);
      setSuccess(true);
      
      // Clear form
      setRating(0);
      setComment('');
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      // Update has reviewed status
      setHasReviewed(true);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle alert close
  const handleAlertClose = () => {
    setError(null);
    setSuccess(false);
  };

  if (hasReviewed) {
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Thank You!
          </Typography>
          <Typography variant="body1">
            You have already reviewed this service. We appreciate your feedback!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Write a Review
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Rate this service:
            </Typography>
            <RatingStars 
              initialValue={rating} 
              onChange={handleRatingChange} 
              showLabel 
            />
          </Box>
          
          <TextField
            label="Your Review"
            multiline
            rows={4}
            value={comment}
            onChange={handleCommentChange}
            fullWidth
            variant="outlined"
            placeholder="Share your experience with this service..."
            sx={{ mb: 3 }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading || !account}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
          
          {!account && (
            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
              Please connect your wallet to submit a review
            </Typography>
          )}
        </Box>
        
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleAlertClose}>
          <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        
        <Snackbar open={success} autoHideDuration={6000} onClose={handleAlertClose}>
          <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>
            Review submitted successfully!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
} 