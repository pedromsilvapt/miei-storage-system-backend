using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StorageSystem.Controllers.DTO;
using StorageSystem.Models;
using StorageSystem.Services;

namespace StorageSystem.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingListController : Controller
    {
        private readonly StorageSystemContext context;

        private readonly ShoppingListService shoppinglistService;
        private readonly UserService userService;
        private readonly StorageService storageService;

        public ShoppingListController(StorageSystemContext context, ShoppingListService shoppinglistService, UserService userService, StorageService storageService)
        {
            this.context = context;
            this.storageService = storageService;
            this.userService = userService;
            this.shoppinglistService = shoppinglistService;
          
        }
  
        public async Task<List<ShoppingListDTO>> ShoppingLists()
        {
            User user = await userService.GetUserAsync(this.User);

            ICollection<ShoppingListItem> list = await shoppinglistService.ShoppingLists(user.Id);
        
            return list
                .Select(ShoppingListDTO.FromModel)
                .ToList();
        }

        [HttpGet("pdf")]
        public async Task<ActionResult> Pdf()
        {
            ReportService productreport = new ReportService();
            byte[] abytes = productreport.PrepareReport(await ShoppingLists());
            return File(abytes, "application/pdf");
        }
        

    }
}
