namespace FSU600_LAB3_API.Models
{
    public class Product
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public float Price { get; set; }
        public string Category { get; set; }
        public string ImageUrl { get; set; }
        public int StockQuantity { get; set; }
        public string Location { get; set; }
    }

}
