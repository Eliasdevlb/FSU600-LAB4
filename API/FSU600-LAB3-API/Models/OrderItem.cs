using FSU600_LAB3_API.Models;

public class OrderItem
{
    public int OrderItemId { get; set; } // Primary key
    public int ProductId { get; set; } // Foreign key to Product
    public int Quantity { get; set; }
    public int OrderId { get; set; } // Foreign key to Order
    public virtual Product Product { get; set; }
    public virtual Order Order { get; set; }
}
