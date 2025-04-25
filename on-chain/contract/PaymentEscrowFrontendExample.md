# PaymentEscrow Contract Frontend Integration (React + starknet.js)

This guide shows how to interact with the PaymentEscrow Cairo contract from a React frontend using starknet.js. It covers core flows: create payment, fund escrow, release milestones, and handle disputes.

---

## Setup
Install starknet.js:
```bash
npm install starknet
```

---

## Helper: Uint256 Conversion
```js
import { uint256 } from "starknet";

function toUint256(amount) {
    return uint256.bnToUint256(BigInt(amount * 1e18));
}
```

---

## Contract Setup
```js
import { Provider, Account, Contract } from "starknet";

const provider = new Provider({ network: "goerli-alpha" });
const account = new Account(
    provider,
    "0xUSER_ADDRESS", // Replace with user's address
    "0xUSER_PRIVATE_KEY" // Use wallet extension for production
);
const escrowAddress = "0xESCROW_CONTRACT_ADDRESS";
const escrowAbi = [/* ... ABI JSON ... */];
const erc20Address = "0xERC20_TOKEN_ADDRESS";
const erc20Abi = [/* ... ABI JSON ... */];
const escrow = new Contract(escrowAbi, escrowAddress, provider);
const erc20 = new Contract(erc20Abi, erc20Address, provider);
```

---

## Example React Component
```jsx
import React, { useState } from "react";
import { Provider, Account, Contract, uint256 } from "starknet";

const provider = new Provider({ network: "goerli-alpha" });
const escrowAddress = "0xESCROW_CONTRACT_ADDRESS";
const escrowAbi = [/* ... ABI JSON ... */];
const erc20Address = "0xERC20_TOKEN_ADDRESS";
const erc20Abi = [/* ... ABI JSON ... */];
const escrow = new Contract(escrowAbi, escrowAddress, provider);
const erc20 = new Contract(erc20Abi, erc20Address, provider);

function toUint256(amount) {
    return uint256.bnToUint256(BigInt(amount * 1e18));
}

export default function PaymentEscrowDemo({ account }) {
    const [paymentId, setPaymentId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Approve escrow contract to spend tokens
    async function approveEscrow(amount) {
        setLoading(true);
        try {
            await account.execute(
                erc20.populate("approve", {
                    spender: escrowAddress,
                    amount: toUint256(amount),
                })
            );
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    // Create a new payment
    async function createPayment(providerAddress, totalAmount, milestoneAmounts) {
        setLoading(true);
        try {
            const call = escrow.populate("create_payment", {
                provider: providerAddress,
                token: erc20Address,
                amount: toUint256(totalAmount),
                milestone_amounts: milestoneAmounts.map(toUint256),
            });
            const { transaction_hash } = await account.execute(call);
            setPaymentId(transaction_hash); // Or fetch from event/log
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    // Fund payment
    async function fundPayment(paymentId) {
        setLoading(true);
        try {
            await account.execute(
                escrow.populate("fund_payment", { payment_id: paymentId })
            );
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    // Release a milestone
    async function releaseMilestone(paymentId, milestoneId) {
        setLoading(true);
        try {
            await account.execute(
                escrow.populate("release_milestone", {
                    payment_id: paymentId,
                    milestone_id: milestoneId,
                })
            );
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    // ... Add more UI and functions for getPaymentHistory, dispute, refund, etc.

    return (
        <div>
            <button onClick={() => approveEscrow(100)}>Approve 100 Tokens</button>
            <button
                onClick={() =>
                    createPayment(
                        "0xPROVIDER_ADDRESS",
                        100,
                        [50, 50]
                    )
                }
            >
                Create Payment
            </button>
            <button onClick={() => fundPayment(paymentId)}>Fund Payment</button>
            <button onClick={() => releaseMilestone(paymentId, 0)}>
                Release First Milestone
            </button>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
```

---

## Notes
- Replace contract addresses and ABI arrays with your deployed contract details.
- Use wallet extensions (Argent X, Braavos) for secure signing in production.
- Always handle errors and transaction status in production UIs.
- Extend the component for dispute, refund, and history flows as needed.

---

For more advanced integration (event listeners, real-time updates, etc.), extend this component or ask for more examples!
