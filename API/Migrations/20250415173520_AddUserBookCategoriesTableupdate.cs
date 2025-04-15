using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddUserBookCategoriesTableupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserBookCategories_Books_BookId1",
                table: "UserBookCategories");

            migrationBuilder.DropIndex(
                name: "IX_UserBookCategories_BookId1",
                table: "UserBookCategories");

            migrationBuilder.DropColumn(
                name: "BookId1",
                table: "UserBookCategories");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BookId1",
                table: "UserBookCategories",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_UserBookCategories_BookId1",
                table: "UserBookCategories",
                column: "BookId1");

            migrationBuilder.AddForeignKey(
                name: "FK_UserBookCategories_Books_BookId1",
                table: "UserBookCategories",
                column: "BookId1",
                principalTable: "Books",
                principalColumn: "BookId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
