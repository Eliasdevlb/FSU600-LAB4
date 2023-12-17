using FSU600_LAB3_API.Models;

public class Order
{
    public int OrderId { get; set; }
    public string UserId { get; set; }
    public virtual User User { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
