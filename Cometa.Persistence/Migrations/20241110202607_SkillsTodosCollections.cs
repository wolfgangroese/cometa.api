using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cometa.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SkillsTodosCollections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_todos_skill_skills_id",
                table: "todos");

            migrationBuilder.DropIndex(
                name: "ix_todos_skills_id",
                table: "todos");

            migrationBuilder.DropPrimaryKey(
                name: "pk_skill",
                table: "skill");

            migrationBuilder.DropColumn(
                name: "skills_id",
                table: "todos");

            migrationBuilder.RenameTable(
                name: "skill",
                newName: "skills");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "skills",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "pk_skills",
                table: "skills",
                column: "id");

            migrationBuilder.CreateTable(
                name: "todo_skill",
                columns: table => new
                {
                    skill_id = table.Column<Guid>(type: "uuid", nullable: false),
                    todo_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_todo_skill", x => new { x.skill_id, x.todo_id });
                    table.ForeignKey(
                        name: "fk_todo_skill_skills_skill_id",
                        column: x => x.skill_id,
                        principalTable: "skills",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_todo_skill_todos_todo_id",
                        column: x => x.todo_id,
                        principalTable: "todos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_todo_skill_todo_id",
                table: "todo_skill",
                column: "todo_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "todo_skill");

            migrationBuilder.DropPrimaryKey(
                name: "pk_skills",
                table: "skills");

            migrationBuilder.RenameTable(
                name: "skills",
                newName: "skill");

            migrationBuilder.AddColumn<Guid>(
                name: "skills_id",
                table: "todos",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "skill",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AddPrimaryKey(
                name: "pk_skill",
                table: "skill",
                column: "id");

            migrationBuilder.CreateIndex(
                name: "ix_todos_skills_id",
                table: "todos",
                column: "skills_id");

            migrationBuilder.AddForeignKey(
                name: "fk_todos_skill_skills_id",
                table: "todos",
                column: "skills_id",
                principalTable: "skill",
                principalColumn: "id");
        }
    }
}
