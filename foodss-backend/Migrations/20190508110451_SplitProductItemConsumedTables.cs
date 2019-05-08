using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StorageSystem.Migrations
{
    public partial class SplitProductItemConsumedTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConsumedDate",
                table: "ProductItems");

            migrationBuilder.CreateTable(
                name: "ConsumedProductItems",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ProductId = table.Column<int>(nullable: false),
                    OwnerId = table.Column<int>(nullable: false),
                    Shared = table.Column<bool>(nullable: false),
                    ExpiryDate = table.Column<DateTime>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    ConsumedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConsumedProductItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConsumedProductItems_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConsumedProductItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConsumedProductItems_OwnerId",
                table: "ConsumedProductItems",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_ConsumedProductItems_ProductId",
                table: "ConsumedProductItems",
                column: "ProductId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConsumedProductItems");

            migrationBuilder.AddColumn<DateTime>(
                name: "ConsumedDate",
                table: "ProductItems",
                nullable: true);
        }
    }
}
