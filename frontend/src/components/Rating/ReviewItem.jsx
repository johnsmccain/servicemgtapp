import { Box, Card, CardContent, Typography, Chip, Avatar } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import RatingStars from './RatingStars';

/**
 * Formats a Unix timestamp to a readable date string
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
const formatTimestamp = (timestamp) => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Review Item Component
 * @param {Object} props - Component props
 * @param {string} props.reviewer - Address of the reviewer
 * @param {number} props.rating - Rating given (1-5)
 * @param {string} props.content - Review content/text
 * @param {number} props.timestamp - Unix timestamp of when the review was posted
 * @param {boolean} props.verified - Whether the review is verified
 */
export default function ReviewItem({
  reviewer,
  rating,
  content,
  timestamp,
  verified,
}) {
  // Truncate reviewer address for display
  const truncatedAddress = reviewer 
    ? `${reviewer.slice(0, 6)}...${reviewer.slice(-4)}`
    : 'Anonymous';

  return (
    <Card sx={{ mb: 2, border: verified ? '1px solid #4caf50' : 'none' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 1, bgcolor: verified ? '#4caf50' : '#9e9e9e' }}>
              {truncatedAddress[0].toUpperCase()}
            </Avatar>
            <Typography variant="subtitle1">
              {truncatedAddress}
              {verified && (
                <VerifiedIcon 
                  color="success" 
                  fontSize="small" 
                  sx={{ ml: 1, verticalAlign: 'middle' }} 
                />
              )}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formatTimestamp(timestamp)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <RatingStars 
            initialValue={rating} 
            readOnly 
            showLabel={false} 
            size="small" 
          />
          {verified && (
            <Chip 
              label="Verified Review" 
              size="small" 
              color="success" 
              variant="outlined" 
              sx={{ ml: 1 }} 
            />
          )}
        </Box>
        
        <Typography variant="body2" color="text.primary">
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
} 