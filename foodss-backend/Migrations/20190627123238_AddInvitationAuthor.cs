using Microsoft.EntityFrameworkCore.Migrations;

namespace StorageSystem.Migrations
{
    public partial class AddInvitationAuthor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AuthorId",
                table: "StorageInvitations",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_StorageInvitations_AuthorId",
                table: "StorageInvitations",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_StorageInvitations_Users_AuthorId",
                table: "StorageInvitations",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StorageInvitations_Users_AuthorId",
                table: "StorageInvitations");

            migrationBuilder.DropIndex(
                name: "IX_StorageInvitations_AuthorId",
                table: "StorageInvitations");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "StorageInvitations");
        }
    }
}
