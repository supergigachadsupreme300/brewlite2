# Use Case: Place and Pay for Order

## Use Case ID
UC-01

## Summary
A customer browses the BrewLite menu, places an order, and completes payment.

## Actors
- Customer
- System
- Staff / Order Fulfillment

## Preconditions
- The menu is available.
- The customer has a valid order entry flow.
- Payment method is available.

## Main Flow
1. Customer opens the menu.
2. Customer selects one or more items.
3. Customer confirms the order.
4. System calculates the total.
5. Customer submits payment.
6. System confirms payment success.
7. System records the order.
8. System notifies the customer and staff of the confirmation.

## Alternate Flows
- Payment fails: the system prompts the user to retry.
- Menu item is unavailable: the system displays an alternative.

## Acceptance Criteria
- Customer can complete ordering without a backend crash.
- Payment result is confirmed.
- Order status becomes visible and traceable.
