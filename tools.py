
@tool
def transfer_fromTo_buckets(buckets, FromBucket, ToBucket, amount):
    """
    This function transfers the user specified amount of money from one bucket to another.
    """
    if FromBucket not in buckets or ToBucket not in buckets:
        return "One or both of the specified buckets do not exist."
    
    if amount <= 0:
        return "The amount to transfer must be greater than zero."
    
    if buckets[FromBucket] < amount:
        return f"Insufficient funds in {FromBucket} bucket."
    
    buckets[FromBucket] -= amount
    buckets[ToBucket] += amount
    
    return f"Transferred ${amount} from {FromBucket} to {ToBucket}. New balances: {FromBucket}: ${buckets[FromBucket]}, {ToBucket}: ${buckets[ToBucket]}"