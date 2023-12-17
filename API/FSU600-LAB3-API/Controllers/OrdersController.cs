using FSU600_LAB3_API.Data;
using FSU600_LAB3_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

[Route("[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OrdersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<Order>> PostOrder([FromBody] OrderCreationDto orderDto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == orderDto.Email);
            if (user == null)
            {
                user = new User { Email = orderDto.Email, UserName = orderDto.Email };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            var order = new Order
            {
                UserId = user.Id,
                TotalPrice = orderDto.TotalPrice,
                Date = DateTime.UtcNow,
                OrderItems = new List<OrderItem>()
            };

            _context.Orders.Add(order);

            foreach (var itemDto in orderDto.Items)
            {
                var product = await _context.Products
                    .Where(p => p.ProductId == itemDto.ProductId)
                    .SingleOrDefaultAsync();

                if (product == null)
                {
                    throw new Exception($"Product with ID {itemDto.ProductId} not found.");
                }

                if (product.StockQuantity < itemDto.Quantity)
                {
                    throw new Exception($"Not enough stock for product ID {itemDto.ProductId}.");
                }

                product.StockQuantity -= itemDto.Quantity;

                var orderItem = new OrderItem
                {
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity,
                    Order = order
                };

                _context.OrderItems.Add(orderItem);
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.OrderId }, order);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(ex.Message);
        }
    }






    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        return await _context.Orders
                             .Include(o => o.User)
                             .Include(o => o.OrderItems)
                                 .ThenInclude(oi => oi.Product)
                             .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var order = await _context.Orders
                                  .Include(o => o.User)
                                  .Include(o => o.OrderItems)
                                      .ThenInclude(oi => oi.Product)
                                  .SingleOrDefaultAsync(o => o.OrderId == id);

        if (order == null)
        {
            return NotFound();
        }

        return order;
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound();
        }

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool OrderExists(int id)
    {
        return _context.Orders.Any(e => e.OrderId == id);
    }

    public class OrderCreationDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Range(0, double.MaxValue)]
        public decimal TotalPrice { get; set; }

        [Required]
        [MinLength(1)]
        public List<OrderItemDto> Items { get; set; }
    }

    public class OrderItemDto
    {
        [Range(1, int.MaxValue)]
        public int ProductId { get; set; }

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }


}
