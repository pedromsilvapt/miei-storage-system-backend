using Microsoft.EntityFrameworkCore.Migrations;

namespace StorageSystem.Migrations
{
    public partial class RemoveForeignKeyStorageInvitationsUserEmail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StorageInvitations_Users_UserEmail",
                table: "StorageInvitations");

            migrationBuilder.DropForeignKey(
                name: "FK_StorageInvitations_Users_UserId",
                table: "StorageInvitations");

            migrationBuilder.DropIndex(
                name: "IX_StorageInvitations_UserEmail",
                table: "StorageInvitations");

            migrationBuilder.DropIndex(
                name: "IX_StorageInvitations_UserId",
                table: "StorageInvitations");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "StorageInvitations");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "StorageInvitations",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StorageInvitations_UserEmail",
                table: "StorageInvitations",
                column: "UserEmail");

            migrationBuilder.CreateIndex(
                name: "IX_StorageInvitations_UserId",
                table: "StorageInvitations",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_StorageInvitations_Users_UserEmail",
                table: "StorageInvitations",
                column: "UserEmail",
                principalTable: "Users",
                principalColumn: "Email",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StorageInvitations_Users_UserId",
                table: "StorageInvitations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
