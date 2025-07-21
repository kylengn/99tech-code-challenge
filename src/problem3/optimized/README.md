# Problem 3: Wallet Page Optimization

## Analysis of Computational Inefficiencies and Anti-Patterns

### 1. **Critical Logic Error**
**Issue**: The filtering logic in the original code is completely broken:
```typescript
const sortedBalances = useMemo(() => {
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    if (lhsPriority > -99) { // ❌ lhsPriority is undefined!
      if (balance.amount <= 0) {
        return true; // ❌ Returns true for zero/negative amounts
      }
    }
    return false // ❌ Always returns false for positive amounts
  })
}, [balances, prices]);
```

**Problems**:
- `lhsPriority` is undefined (should be `balancePriority`)
- Logic is inverted - returns `true` for zero/negative amounts
- Always returns `false` for positive amounts
- This means NO balances would ever be displayed

**Solution**: Fixed filtering logic in `utils/blockchain.ts`:
```typescript
export const shouldIncludeBalance = (balance: { blockchain: string; amount: number }): boolean => {
  const priority = getBlockchainPriority(balance.blockchain);
  return priority > DEFAULT_PRIORITY && balance.amount > 0;
};
```

### 2. **Unnecessary Re-computations**
**Issue**: The `getPriority` function is recreated on every render:
```typescript
const getPriority = (blockchain: any): number => {
  switch (blockchain) {
    case 'Osmosis': return 100
    // ... rest of cases
  }
}
```

**Problems**:
- Function object recreated on every render
- Called multiple times in filter and sort operations
- No memoization of expensive operations

**Solution**: Moved to static utility with proper typing:
```typescript
export const BLOCKCHAIN_PRIORITIES: Record<BlockchainType, number> = {
  'Osmosis': 100,
  'Ethereum': 50,
  // ...
} as const;
```

### 3. **Inefficient useMemo Dependencies**
**Issue**: `prices` dependency in `sortedBalances` useMemo is unnecessary:
```typescript
const sortedBalances = useMemo(() => {
  // ... sorting logic that doesn't use prices
}, [balances, prices]); // ❌ prices not used in calculation
```

**Problem**: Causes unnecessary re-computations when prices change, even though prices aren't used in the sorting logic.

**Solution**: Removed unnecessary dependency:
```typescript
const sortedBalances = useMemo(() => {
  return balances
    .filter(shouldIncludeBalance)
    .sort(/* sorting logic */);
}, [balances]); // ✅ Only depends on balances
```

### 4. **Missing Memoization**
**Issue**: `formattedBalances` and `rows` are recalculated on every render:
```typescript
const formattedBalances = sortedBalances.map(/* ... */) // ❌ No memoization
const rows = sortedBalances.map(/* ... */) // ❌ No memoization
```

**Problem**: Expensive operations run on every render, even when data hasn't changed.

**Solution**: Added proper memoization:
```typescript
const formattedBalances = useMemo(() => {
  return sortedBalances.map(/* ... */);
}, [sortedBalances]);

const rows = useMemo(() => {
  return balances.map(/* ... */);
}, [balances, prices]);
```

### 5. **Poor React Key Usage**
**Issue**: Using array index as key:
```typescript
<WalletRow key={index} /* ... */ />
```

**Problem**: Can cause React reconciliation issues and potential bugs when items are reordered or filtered.

**Solution**: Better key generation:
```typescript
<WalletRow
  key={`${balance.currency}-${balance.blockchain}-${index}`}
  /* ... */
/>
```

### 6. **Type Safety Issues**
**Issue**: Poor TypeScript usage:
```typescript
const getPriority = (blockchain: any): number => { // ❌ any type
```

**Problems**:
- No type safety for blockchain names
- Potential runtime errors
- Poor IDE support

**Solution**: Proper TypeScript types:
```typescript
export type BlockchainType = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';
export const getBlockchainPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain as BlockchainType] ?? DEFAULT_PRIORITY;
};
```

### 7. **Missing Error Handling**
**Issue**: No handling for missing price data:
```typescript
const usdValue = prices[balance.currency] * balance.amount; // ❌ Could be NaN
```

**Problem**: If price is undefined, result will be NaN.

**Solution**: Added fallback:
```typescript
const usdValue = (prices[balance.currency] || 0) * balance.amount;
```

### 8. **Poor Code Organization**
**Issue**: All logic mixed in one component:
- Business logic (priority calculation)
- Data processing (filtering, sorting)
- UI rendering
- All in one file

**Problem**: Hard to test, maintain, and reuse.

**Solution**: Split into proper folder structure:
```
optimized/
├── types/index.ts          # Type definitions
├── utils/blockchain.ts     # Business logic
├── hooks/useWalletData.ts  # Data processing
├── components/WalletRow.tsx # UI components
└── wallet-page.tsx         # Main component
```

## Performance Improvements

### 1. **Reduced Re-renders**
- Memoized `WalletRow` component prevents unnecessary re-renders
- Proper dependency arrays in `useMemo` hooks
- Separated data processing from UI rendering

### 2. **Optimized Calculations**
- Static blockchain priority mapping
- Single-pass filtering and sorting
- Memoized expensive operations

### 3. **Better Memory Usage**
- No function recreation on every render
- Proper cleanup of memoized values
- Efficient data structures

## Code Quality Improvements

### 1. **Separation of Concerns**
- Business logic in utils
- Data processing in hooks
- UI components isolated
- Types centralized

### 2. **Testability**
- Pure functions for business logic
- Isolated components
- Clear interfaces

### 3. **Maintainability**
- Clear file structure
- Consistent naming
- Proper documentation
- Type safety

## Summary

The original code had multiple critical issues that would prevent it from working correctly, along with significant performance problems. The optimized version:

1. **Fixes the broken logic** that would show no balances
2. **Improves performance** through proper memoization
3. **Enhances maintainability** through better code organization
4. **Increases type safety** with proper TypeScript usage
5. **Follows React best practices** for component structure and hooks usage

The split-code approach makes the codebase more scalable, testable, and maintainable while significantly improving runtime performance. 