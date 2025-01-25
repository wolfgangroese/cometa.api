using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cometa.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class MigrationName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.RenameIndex(
                name: "ix_todo_skill_todo_id",
                table: "todo_skill",
                newName: "IX_TodoSkill_TodoId");

            migrationBuilder.AlterColumn<int>(
                name: "spent_time",
                table: "todos",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "rewards",
                table: "todos",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "priority",
                table: "todos",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<bool>(
                name: "is_completed",
                table: "todos",
                type: "boolean",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AlterColumn<int>(
                name: "estimated_time",
                table: "todos",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "complexity",
                table: "todos",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_ChildTodoId",
                table: "todos",
                column: "child_todo_id");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_NextTodoId",
                table: "todos",
                column: "next_todo_id");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_ParentTodoId",
                table: "todos",
                column: "parent_todo_id");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_PreviousTodoId",
                table: "todos",
                column: "previous_todo_id");

            migrationBuilder.CreateIndex(
                name: "IX_TodoSkill_SkillId",
                table: "todo_skill",
                column: "skill_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Todos_ChildTodoId",
                table: "todos");

            migrationBuilder.DropIndex(
                name: "IX_Todos_NextTodoId",
                table: "todos");

            migrationBuilder.DropIndex(
                name: "IX_Todos_ParentTodoId",
                table: "todos");

            migrationBuilder.DropIndex(
                name: "IX_Todos_PreviousTodoId",
                table: "todos");

            migrationBuilder.DropIndex(
                name: "IX_TodoSkill_SkillId",
                table: "todo_skill");

            migrationBuilder.RenameIndex(
                name: "IX_TodoSkill_TodoId",
                table: "todo_skill",
                newName: "ix_todo_skill_todo_id");

            migrationBuilder.AlterColumn<int>(
                name: "spent_time",
                table: "todos",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "rewards",
                table: "todos",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "priority",
                table: "todos",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "is_completed",
                table: "todos",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "estimated_time",
                table: "todos",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "complexity",
                table: "todos",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

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
        }
    }
}
