import { useState } from 'react';
import { Box, Container, Typography, Tab, Tabs, Paper } from '@mui/material';
import ReviewsList from './ReviewsList';
import SubmitReview from './SubmitReview';
import { useAccount } from '@starknet-react/core';
import ConnectWallet from '../ConnectWallet';

/**
 * Rating and Review System Component
 * This is the main component that integrates all rating and review functionalities
 * 
 * @param {Object} props - Component props
 * @param {string} props.providerId - ID of the service provider
 * @param {string} props.serviceId - ID of the service
 * @param {string} props.serviceName - Name of the service
 */
export default function RatingReviewSystem({ providerId, serviceId, serviceName }) {
  const [tabValue, setTabValue] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { account } = useAccount();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleReviewSubmitted = () => {
    // Trigger refresh of reviews list
    setRefreshTrigger(prev => prev + 1);
    // Switch to reviews tab
    setTabValue(0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {serviceName}
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Reviews" />
          <Tab label="Write a Review" />
        </Tabs>
      </Paper>
      
      <Box role="tabpanel" hidden={tabValue !== 0}>
        {tabValue === 0 && (
          <ReviewsList
            providerId={providerId}
            key={refreshTrigger} // Force re-render when refreshTrigger changes
          />
        )}
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 1}>
        {tabValue === 1 && (
          account ? (
            <SubmitReview
              providerId={providerId}
              serviceId={serviceId}
              onReviewSubmitted={handleReviewSubmitted}
            />
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Connect Your Wallet to Write a Review
              </Typography>
              <Typography variant="body1" paragraph>
                You need to connect your wallet to verify your identity before submitting a review.
              </Typography>
              <ConnectWallet />
            </Box>
          )
        )}
      </Box>
    </Container>
  );
} 