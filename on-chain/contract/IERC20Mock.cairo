// Minimal ERC-20 Mock for PaymentEscrow Testing (Cairo 1.0)
%lang starknet

@storage_var
func balances(address: felt252) -> (res: felt252) {}

@external
func transferFrom(sender: felt252, recipient: felt252, amount: Uint256) -> ():
    let (sender_balance) = balances.read(sender)
    assert sender_balance >= amount.low, 'Insufficient balance'
    balances.write(sender, sender_balance - amount.low)
    let (recipient_balance) = balances.read(recipient)
    balances.write(recipient, recipient_balance + amount.low)
    return ()
end

@external
func transfer(recipient: felt252, amount: Uint256) -> ():
    let (caller) = get_caller_address()
    let (caller_balance) = balances.read(caller)
    assert caller_balance >= amount.low, 'Insufficient balance'
    balances.write(caller, caller_balance - amount.low)
    let (recipient_balance) = balances.read(recipient)
    balances.write(recipient, recipient_balance + amount.low)
    return ()
end

@external
func mint(to: felt252, amount: felt252) -> ():
    let (balance) = balances.read(to)
    balances.write(to, balance + amount)
    return ()
end
