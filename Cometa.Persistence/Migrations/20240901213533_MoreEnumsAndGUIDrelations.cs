using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cometa.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class MoreEnumsAndGUIDrelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_todos_skill_skill_id",
                table: "todos");

            migrationBuilder.RenameColumn(
                name: "skill_id",
                table: "todos",
                newName: "skills_id");

            migrationBuilder.RenameIndex(
                name: "ix_todos_skill_id",
                table: "todos",
                newName: "ix_todos_skills_id");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "todos",
                type: "character varying(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(120)",
                oldMaxLength: 120,
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "child_todo_id",
                table: "todos",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "completed_date",
                table: "todos",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "creation_status",
                table: "todos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "earliest_start_date",
                table: "todos",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "next_todo_id",
                table: "todos",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "notes",
                table: "todos",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "parent_todo_id",
                table: "todos",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "previous_todo_id",
                table: "todos",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_todos_child_todo_id",
                table: "todos",
                column: "child_todo_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_todos_next_todo_id",
                table: "todos",
                column: "next_todo_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_todos_parent_todo_id",
                table: "todos",
                column: "parent_todo_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_todos_previous_todo_id",
                table: "todos",
                column: "previous_todo_id",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_todos_skill_skills_id",
                table: "todos",
                column: "skills_id",
                principalTable: "skill",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_todos_todos_child_todo_id",
                table: "todos",
                column: "child_todo_id",
                principalTable: "todos",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_todos_todos_next_todo_id",
                table: "todos",
                column: "next_todo_id",
                principalTable: "todos",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_todos_todos_parent_todo_id",
                table: "todos",
                column: "parent_todo_id",
                principalTable: "todos",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_todos_todos_previous_todo_id",
                table: "todos",
                column: "previous_todo_id",
                principalTable: "todos",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_todos_skill_skills_id",
                table: "todos");

            migrationBuilder.DropForeignKey(
                name: "fk_todos_todos_child_todo_id",
                table: "todos");

            migrationBuilder.DropForeignKey(
                name: "fk_todos_todos_next_todo_id",
                table: "todos");

            migrationBuilder.DropForeignKey(
                name: "fk_todos_todos_parent_todo_id",
                table: "todos");

            migrationBuilder.DropForeignKey(
                name: "fk_todos_todos_previous_todo_id",
                table: "todos");

            migrationBuilder.DropIndex(
                name: "ix_todos_child_todo_id",
                table: "todos");

            migrationBuilder.DropIndex(
                name: "ix_todos_next_todo_id",
                table: "todos");

            migrationBuilder.DropIndex(
                name: "ix_todos_parent_todo_id",
                table: "todos");

            migrationBuilder.DropIndex(
                name: "ix_todos_previous_todo_id",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "child_todo_id",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "completed_date",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "creation_status",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "earliest_start_date",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "next_todo_id",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "notes",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "parent_todo_id",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "previous_todo_id",
                table: "todos");

            migrationBuilder.RenameColumn(
                name: "skills_id",
                table: "todos",
                newName: "skill_id");

            migrationBuilder.RenameIndex(
                name: "ix_todos_skills_id",
                table: "todos",
                newName: "ix_todos_skill_id");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "todos",
                type: "character varying(120)",
                maxLength: 120,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(120)",
                oldMaxLength: 120);

            migrationBuilder.AddForeignKey(
                name: "fk_todos_skill_skill_id",
                table: "todos",
                column: "skill_id",
                principalTable: "skill",
                principalColumn: "id");
        }
    }
}
