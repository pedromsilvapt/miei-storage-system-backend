using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StorageSystem.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 200, nullable: false),
                    Email = table.Column<string>(maxLength: 254, nullable: false),
                    Password = table.Column<string>(maxLength: 264, nullable: false),
                    Salt = table.Column<string>(maxLength: 8, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.UniqueConstraint("AK_Users_Email", x => x.Email);
                });

            migrationBuilder.CreateTable(
                name: "Storages",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    Type = table.Column<int>(nullable: false),
                    OwnerId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Storages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Storages_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 200, nullable: false),
                    Barcode = table.Column<string>(maxLength: 200, nullable: true),
                    HasExpiryDate = table.Column<bool>(nullable: false),
                    StorageId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Storages_StorageId",
                        column: x => x.StorageId,
                        principalTable: "Storages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StorageInvitations",
                columns: table => new
                {
                    StorageId = table.Column<int>(nullable: false),
                    UserEmail = table.Column<string>(maxLength: 254, nullable: false),
                    UserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StorageInvitations", x => new { x.StorageId, x.UserEmail });
                    table.ForeignKey(
                        name: "FK_StorageInvitations_Storages_StorageId",
                        column: x => x.StorageId,
                        principalTable: "Storages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StorageInvitations_Users_UserEmail",
                        column: x => x.UserEmail,
                        principalTable: "Users",
                        principalColumn: "Email",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StorageInvitations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StorageUsers",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    StorageId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StorageUsers", x => new { x.StorageId, x.UserId });
                    table.ForeignKey(
                        name: "FK_StorageUsers_Storages_StorageId",
                        column: x => x.StorageId,
                        principalTable: "Storages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StorageUsers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductItems",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ProductId = table.Column<int>(nullable: false),
                    OwnerId = table.Column<int>(nullable: false),
                    Shared = table.Column<bool>(nullable: false),
                    ExpiryDate = table.Column<DateTime>(nullable: false),
                    AvailableCount = table.Column<int>(nullable: false),
                    ConsumedCount = table.Column<int>(nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductItems_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ShoppingListItems",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    StorageId = table.Column<int>(nullable: false),
                    ProductId = table.Column<int>(nullable: false),
                    OwnerId = table.Column<int>(nullable: false),
                    Count = table.Column<int>(nullable: false),
                    UserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShoppingListItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShoppingListItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShoppingListItems_Storages_StorageId",
                        column: x => x.StorageId,
                        principalTable: "Storages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShoppingListItems_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserProductPreferences",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    ProductId = table.Column<int>(nullable: false),
                    MinCount = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProductPreferences", x => new { x.UserId, x.ProductId });
                    table.ForeignKey(
                        name: "FK_UserProductPreferences_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserProductPreferences_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductItems_OwnerId",
                table: "ProductItems",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductItems_ProductId",
                table: "ProductItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_StorageId",
                table: "Products",
                column: "StorageId");

            migrationBuilder.CreateIndex(
                name: "IX_ShoppingListItems_ProductId",
                table: "ShoppingListItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ShoppingListItems_StorageId",
                table: "ShoppingListItems",
                column: "StorageId");

            migrationBuilder.CreateIndex(
                name: "IX_ShoppingListItems_UserId",
                table: "ShoppingListItems",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_StorageInvitations_UserEmail",
                table: "StorageInvitations",
                column: "UserEmail");

            migrationBuilder.CreateIndex(
                name: "IX_StorageInvitations_UserId",
                table: "StorageInvitations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Storages_OwnerId",
                table: "Storages",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_StorageUsers_UserId",
                table: "StorageUsers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProductPreferences_ProductId",
                table: "UserProductPreferences",
                column: "ProductId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductItems");

            migrationBuilder.DropTable(
                name: "ShoppingListItems");

            migrationBuilder.DropTable(
                name: "StorageInvitations");

            migrationBuilder.DropTable(
                name: "StorageUsers");

            migrationBuilder.DropTable(
                name: "UserProductPreferences");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Storages");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
