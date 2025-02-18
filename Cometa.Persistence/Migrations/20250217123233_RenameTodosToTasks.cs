using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cometa.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameTodosToTasks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TodoSkill");

            migrationBuilder.DropTable(
                name: "Todos");

            migrationBuilder.CreateTable(
                name: "Task",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    TaskStatus = table.Column<int>(type: "integer", nullable: false),
                    Priority = table.Column<int>(type: "integer", nullable: true),
                    Complexity = table.Column<int>(type: "integer", nullable: true),
                    Rewards = table.Column<int>(type: "integer", nullable: true),
                    EstimatedTime = table.Column<int>(type: "integer", nullable: true),
                    SpentTime = table.Column<int>(type: "integer", nullable: true),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EarliestStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ParentTaskId = table.Column<Guid>(type: "uuid", nullable: true),
                    ChildTaskId = table.Column<Guid>(type: "uuid", nullable: true),
                    NextTaskId = table.Column<Guid>(type: "uuid", nullable: true),
                    PreviousTaskId = table.Column<Guid>(type: "uuid", nullable: true),
                    Notes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreationStatus = table.Column<int>(type: "integer", nullable: false),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(110)", maxLength: 110, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ModifiedBy = table.Column<string>(type: "character varying(110)", maxLength: 110, nullable: true),
                    ModifiedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Task", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Task_Task_ChildTaskId",
                        column: x => x.ChildTaskId,
                        principalTable: "Task",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Task_Task_NextTaskId",
                        column: x => x.NextTaskId,
                        principalTable: "Task",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Task_Task_ParentTaskId",
                        column: x => x.ParentTaskId,
                        principalTable: "Task",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Task_Task_PreviousTaskId",
                        column: x => x.PreviousTaskId,
                        principalTable: "Task",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TaskSkill",
                columns: table => new
                {
                    SkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    TaskId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskSkill", x => new { x.SkillId, x.TaskId });
                    table.ForeignKey(
                        name: "FK_TaskSkill_Skills_SkillId",
                        column: x => x.SkillId,
                        principalTable: "Skills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TaskSkill_Task_TaskId",
                        column: x => x.TaskId,
                        principalTable: "Task",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ChildTaskId",
                table: "Task",
                column: "ChildTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_NextTaskId",
                table: "Task",
                column: "NextTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ParentTaskId",
                table: "Task",
                column: "ParentTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_PreviousTaskId",
                table: "Task",
                column: "PreviousTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskSkill_SkillId",
                table: "TaskSkill",
                column: "SkillId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskSkill_TaskId",
                table: "TaskSkill",
                column: "TaskId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TaskSkill");

            migrationBuilder.DropTable(
                name: "Task");

            migrationBuilder.CreateTable(
                name: "Todos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ChildTodoId = table.Column<Guid>(type: "uuid", nullable: true),
                    NextTodoId = table.Column<Guid>(type: "uuid", nullable: true),
                    ParentTodoId = table.Column<Guid>(type: "uuid", nullable: true),
                    PreviousTodoId = table.Column<Guid>(type: "uuid", nullable: true),
                    CompletedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Complexity = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying(110)", maxLength: 110, nullable: true),
                    CreationStatus = table.Column<int>(type: "integer", nullable: false),
                    Deleted = table.Column<bool>(type: "boolean", nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EarliestStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EstimatedTime = table.Column<int>(type: "integer", nullable: true),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: true),
                    ModifiedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ModifiedBy = table.Column<string>(type: "character varying(110)", maxLength: 110, nullable: true),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Notes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Priority = table.Column<int>(type: "integer", nullable: true),
                    Rewards = table.Column<int>(type: "integer", nullable: true),
                    SpentTime = table.Column<int>(type: "integer", nullable: true),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TodoStatus = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Todos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Todos_Todos_ChildTodoId",
                        column: x => x.ChildTodoId,
                        principalTable: "Todos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Todos_Todos_NextTodoId",
                        column: x => x.NextTodoId,
                        principalTable: "Todos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Todos_Todos_ParentTodoId",
                        column: x => x.ParentTodoId,
                        principalTable: "Todos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Todos_Todos_PreviousTodoId",
                        column: x => x.PreviousTodoId,
                        principalTable: "Todos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TodoSkill",
                columns: table => new
                {
                    SkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    TodoId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TodoSkill", x => new { x.SkillId, x.TodoId });
                    table.ForeignKey(
                        name: "FK_TodoSkill_Skills_SkillId",
                        column: x => x.SkillId,
                        principalTable: "Skills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TodoSkill_Todos_TodoId",
                        column: x => x.TodoId,
                        principalTable: "Todos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Todos_ChildTodoId",
                table: "Todos",
                column: "ChildTodoId");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_NextTodoId",
                table: "Todos",
                column: "NextTodoId");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_ParentTodoId",
                table: "Todos",
                column: "ParentTodoId");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_PreviousTodoId",
                table: "Todos",
                column: "PreviousTodoId");

            migrationBuilder.CreateIndex(
                name: "IX_TodoSkill_SkillId",
                table: "TodoSkill",
                column: "SkillId");

            migrationBuilder.CreateIndex(
                name: "IX_TodoSkill_TodoId",
                table: "TodoSkill",
                column: "TodoId");
        }
    }
}
