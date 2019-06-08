using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StorageSystem.Migrations
{
    public partial class StorageTemperaturesAndCities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CityId",
                table: "Storages",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastWeatherForecast",
                table: "Storages",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "LastWeatherForecastTemperature",
                table: "Storages",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Cities",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: false),
                    Country = table.Column<string>(nullable: false),
                    CoordinatesLatitude = table.Column<double>(nullable: false),
                    CoordinatesLongitude = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cities", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Storages_CityId",
                table: "Storages",
                column: "CityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Storages_Cities_CityId",
                table: "Storages",
                column: "CityId",
                principalTable: "Cities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Storages_Cities_CityId",
                table: "Storages");

            migrationBuilder.DropTable(
                name: "Cities");

            migrationBuilder.DropIndex(
                name: "IX_Storages_CityId",
                table: "Storages");

            migrationBuilder.DropColumn(
                name: "CityId",
                table: "Storages");

            migrationBuilder.DropColumn(
                name: "LastWeatherForecast",
                table: "Storages");

            migrationBuilder.DropColumn(
                name: "LastWeatherForecastTemperature",
                table: "Storages");
        }
    }
}
