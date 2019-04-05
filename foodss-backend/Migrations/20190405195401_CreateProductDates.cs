using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StorageSystem.Migrations
{
    public partial class CreateProductDates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvailableCount",
                table: "ProductItems");

            migrationBuilder.DropColumn(
                name: "ConsumedCount",
                table: "ProductItems");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ExpiryDate",
                table: "ProductItems",
                nullable: true,
                oldClrType: typeof(DateTime));

            migrationBuilder.AddColumn<DateTime>(
                name: "AddedDate",
                table: "ProductItems",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ConsumedDate",
                table: "ProductItems",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddedDate",
                table: "ProductItems");

            migrationBuilder.DropColumn(
                name: "ConsumedDate",
                table: "ProductItems");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ExpiryDate",
                table: "ProductItems",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AvailableCount",
                table: "ProductItems",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ConsumedCount",
                table: "ProductItems",
                nullable: false,
                defaultValue: 0);
        }
    }
}
