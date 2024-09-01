using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cometa.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Enums : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "todos",
                type: "character varying(120)",
                maxLength: 120,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "description",
                table: "todos",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "complexity",
                table: "todos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "due_date",
                table: "todos",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "end_date",
                table: "todos",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "estimated_time",
                table: "todos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "priority",
                table: "todos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "rewards",
                table: "todos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "skill_id",
                table: "todos",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "spent_time",
                table: "todos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "start_date",
                table: "todos",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "todo_status",
                table: "todos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "skill",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    prevalence = table.Column<int>(type: "integer", nullable: false),
                    created_by = table.Column<string>(type: "character varying(110)", maxLength: 110, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    modified_by = table.Column<string>(type: "character varying(110)", maxLength: 110, nullable: true),
                    modified_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_skill", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_todos_skill_id",
                table: "todos",
                column: "skill_id");

            migrationBuilder.AddForeignKey(
                name: "fk_todos_skill_skill_id",
                table: "todos",
                column: "skill_id",
                principalTable: "skill",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_todos_skill_skill_id",
                table: "todos");

            migrationBuilder.DropTable(
                name: "skill");

            migrationBuilder.DropIndex(
                name: "ix_todos_skill_id",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "complexity",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "due_date",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "end_date",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "estimated_time",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "priority",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "rewards",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "skill_id",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "spent_time",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "start_date",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "todo_status",
                table: "todos");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "todos",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(120)",
                oldMaxLength: 120,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "description",
                table: "todos",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);
        }
    }
}
