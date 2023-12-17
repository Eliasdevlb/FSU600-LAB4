using FSU600_LAB3_API.Models;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;

namespace FSU600_LAB3_API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(ApplicationDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {

            if (context.Products.Any())
            {
                return; 
            }

            var products = new Product[]
            {
                new Product{Name="Volvo XC90", Description="På resan mot att bli ett renodlat elbilsföretag till 2030, finns denna bilmodell numera endast tillgänglig med laddbara motoralternativ. Volvo XC90 Recharge ger dig maximal komfort och underhållande köregenskaper.", Price=1000000, StockQuantity=2, Category="Cars", Location="Göteborg Stenpiren", ImageUrl="https://www.volvocars.com/images/v/-/media/applications/pdpspecificationpage/my24/xc90-fuel/pdp/xc90-fuel-hero-21x9.jpg?iar=0&w=1920"},
                new Product{Name="Volvo XC60", Description="På resan mot att bli ett renodlat elbilsföretag till 2030, finns denna bilmodell numera endast tillgänglig med laddbara motoralternativ. Volvo XC60 Recharge ger dig maximal komfort och underhållande köregenskaper.", Price=2000000, StockQuantity=4, Category="Cars", Location="Göteborg Centralstation", ImageUrl="https://www.volvocars.com/images/v/-/media/applications/pdpspecificationpage/my24/xc60-fuel/pdp/xc60-fuel-hero-21x9.jpg?iar=0&w=1920"},
            };

            foreach (Product p in products)
            {
                context.Products.Add(p);
            }
            context.SaveChanges();

            string adminRoleName = "Admin";
            string userRoleName = "User";

            if (!await roleManager.RoleExistsAsync(adminRoleName))
            {
                await roleManager.CreateAsync(new IdentityRole(adminRoleName));
            }
            if (!await roleManager.RoleExistsAsync(userRoleName))
            {
                await roleManager.CreateAsync(new IdentityRole(userRoleName));
            }

            var adminUser = new IdentityUser { UserName = "admin@test.com", Email = "admin@test.com" };
            var testUser = new IdentityUser { UserName = "user@test.com", Email = "user@test.com" };

            string adminPassword = "Admin@123";
            string userPassword = "User@123";

            var _adminUser = await userManager.FindByNameAsync(adminUser.UserName);
            if (_adminUser == null)
            {
                var createAdminUser = await userManager.CreateAsync(adminUser, adminPassword);
                if (createAdminUser.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, adminRoleName);
                }
            }

            var _testUser = await userManager.FindByNameAsync(testUser.UserName);
            if (_testUser == null)
            {
                var createUser = await userManager.CreateAsync(testUser, userPassword);
                if (createUser.Succeeded)
                {
                    await userManager.AddToRoleAsync(testUser, userRoleName);
                }
            }
        }
    }
}
