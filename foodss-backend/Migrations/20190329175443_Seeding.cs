using Microsoft.EntityFrameworkCore.Migrations;

namespace StorageSystem.Migrations
{
    public partial class Seeding : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Storages",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "Despensa Privada");

            migrationBuilder.UpdateData(
                table: "Storages",
                keyColumn: "Id",
                keyValue: 2,
                column: "Name",
                value: "Despensa Partilhada");

            migrationBuilder.UpdateData(
                table: "Storages",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "Despensa Partilhada");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Storages",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "Dispensa Privada");

            migrationBuilder.UpdateData(
                table: "Storages",
                keyColumn: "Id",
                keyValue: 2,
                column: "Name",
                value: "Dispensa Partilhada");

            migrationBuilder.UpdateData(
                table: "Storages",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "Dispensa Partilhada");
        }
    }
}
