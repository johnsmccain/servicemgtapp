import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useConnect, useAccount, useDisconnect } from '@starknet-react/core';

/**
 * Connect Wallet Component
 * This component handles wallet connection functionality for Starknet
 */
export default function ConnectWallet() {
  const [open, setOpen] = useState(false);
  const { connect, connectors, isConnecting, refresh } = useConnect();
  const { account, address, status } = useAccount();
  const { disconnect } = useDisconnect();

  // Handle wallet connection dialog open/close
  const handleClickOpen = () => {
    refresh();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle wallet connection
  const handleConnect = (connector) => {
    connect({ connector });
    setOpen(false);
  };

  // Handle wallet disconnection
  const handleDisconnect = () => {
    disconnect();
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      {status === 'connected' && address ? (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleDisconnect}
          startIcon={<AccountBalanceWalletIcon />}
        >
          {formatAddress(address)}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          startIcon={<AccountBalanceWalletIcon />}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Connect Wallet</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Connect with one of the available wallet providers:
          </Typography>
          
          {isConnecting && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}
          
          <List sx={{ pt: 0 }}>
            {connectors.map((connector) => (
              <ListItem disableGutters key={connector.id}>
                <ListItemButton onClick={() => handleConnect(connector)}>
                  <ListItemAvatar>
                    <Avatar>
                      <AccountBalanceWalletIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={connector.name || connector.id} 
                    secondary={connector.available 
                      ? 'Available' 
                      : 'Not installed'
                    } 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 