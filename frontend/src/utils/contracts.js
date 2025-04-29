// Address for deployed contracts (these should be updated with actual addresses after deployment)
export const CONTRACT_ADDRESSES = {
  // Testnet addresses (Goerli)
  TESTNET: {
    RATING_REVIEW: '0x0', // Placeholder - replace with actual address after deployment
    SERVICE_MARKETPLACE: '0x0', // Placeholder - replace with actual address after deployment
    PROVIDER_REGISTRY: '0x0', // Placeholder - replace with actual address after deployment
  },
  // Mainnet addresses
  MAINNET: {
    RATING_REVIEW: '0x0', // Placeholder - replace with actual address after deployment
    SERVICE_MARKETPLACE: '0x0', // Placeholder - replace with actual address after deployment
    PROVIDER_REGISTRY: '0x0', // Placeholder - replace with actual address after deployment
  }
}

// ABIs for contracts
export const RATING_REVIEW_ABI = [
  {
    name: "constructor",
    type: "function",
    inputs: [
      { name: "admin_address", type: "ContractAddress" },
      { name: "marketplace_address", type: "ContractAddress" },
      { name: "registry_address", type: "ContractAddress" }
    ],
    outputs: [],
    state_mutability: "external"
  },
  {
    name: "submit_review",
    type: "function",
    inputs: [
      { name: "provider_id", type: "felt252" },
      { name: "service_id", type: "felt252" },
      { name: "rating", type: "felt252" },
      { name: "content", type: "felt252" }
    ],
    outputs: [{ name: "review_id", type: "felt252" }],
    state_mutability: "external"
  },
  {
    name: "verify_review",
    type: "function",
    inputs: [
      { name: "provider_id", type: "felt252" },
      { name: "review_id", type: "felt252" }
    ],
    outputs: [],
    state_mutability: "external"
  },
  {
    name: "get_provider_rating",
    type: "function",
    inputs: [{ name: "provider_id", type: "felt252" }],
    outputs: [
      { name: "avg_rating", type: "felt252" },
      { name: "review_count", type: "felt252" }
    ],
    state_mutability: "view"
  },
  {
    name: "get_review",
    type: "function",
    inputs: [
      { name: "provider_id", type: "felt252" },
      { name: "review_id", type: "felt252" }
    ],
    outputs: [
      { name: "reviewer", type: "ContractAddress" },
      { name: "service_id", type: "felt252" },
      { name: "rating", type: "felt252" },
      { name: "timestamp", type: "felt252" },
      { name: "verified", type: "felt252" },
      { name: "content", type: "felt252" }
    ],
    state_mutability: "view"
  },
  {
    name: "get_provider_reviews",
    type: "function",
    inputs: [
      { name: "provider_id", type: "felt252" },
      { name: "offset", type: "felt252" },
      { name: "limit", type: "felt252" }
    ],
    outputs: [
      { name: "review_ids_len", type: "felt252" },
      { name: "review_ids", type: "felt252*" }
    ],
    state_mutability: "view"
  },
  {
    name: "check_has_reviewed",
    type: "function",
    inputs: [
      { name: "reviewer", type: "ContractAddress" },
      { name: "service_id", type: "felt252" }
    ],
    outputs: [{ name: "has_reviewed", type: "felt252" }],
    state_mutability: "view"
  },
  {
    name: "filter_reviews_by_rating",
    type: "function",
    inputs: [
      { name: "provider_id", type: "felt252" },
      { name: "min_rating", type: "felt252" },
      { name: "max_rating", type: "felt252" },
      { name: "offset", type: "felt252" },
      { name: "limit", type: "felt252" }
    ],
    outputs: [
      { name: "review_ids_len", type: "felt252" },
      { name: "review_ids", type: "felt252*" }
    ],
    state_mutability: "view"
  },
  {
    name: "get_weighted_rating",
    type: "function",
    inputs: [{ name: "provider_id", type: "felt252" }],
    outputs: [{ name: "weighted_rating", type: "felt252" }],
    state_mutability: "view"
  }
]; 