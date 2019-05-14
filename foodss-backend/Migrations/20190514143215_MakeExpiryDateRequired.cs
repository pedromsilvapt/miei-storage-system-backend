using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StorageSystem.Migrations
{
    public partial class MakeExpiryDateRequired : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasExpiryDate",
                table: "Products");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ExpiryDate",
                table: "ProductItems",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "ExpiryDate",
                table: "ConsumedProductItems",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasExpiryDate",
                table: "Products",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<DateTime>(
                name: "ExpiryDate",
                table: "ProductItems",
                nullable: true,
                oldClrType: typeof(DateTime));

            migrationBuilder.AlterColumn<DateTime>(
                name: "ExpiryDate",
                table: "ConsumedProductItems",
                nullable: true,
                oldClrType: typeof(DateTime));
        }
    }
}
