using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SamenSterkerApi.Migrations
{
    /// <inheritdoc />
    public partial class AddBuddyRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BuddyRelations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    BuddyId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuddyRelations", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BuddyRelations_UserId_BuddyId",
                table: "BuddyRelations",
                columns: new[] { "UserId", "BuddyId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BuddyRelations");
        }
    }
}
