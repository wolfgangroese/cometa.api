using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Cometa.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddNewTodoIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_todo_skill_skills_skill_id",
                table: "todo_skill");

            migrationBuilder.DropForeignKey(
                name: "fk_todo_skill_todos_todo_id",
                table: "todo_skill");

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

            migrationBuilder.DropPrimaryKey(
                name: "pk_todos",
                table: "todos");

            migrationBuilder.DropPrimaryKey(
                name: "pk_skills",
                table: "skills");

            migrationBuilder.DropPrimaryKey(
                name: "pk_todo_skill",
                table: "todo_skill");

            migrationBuilder.RenameTable(
                name: "todos",
                newName: "Todos");

            migrationBuilder.RenameTable(
                name: "skills",
                newName: "Skills");

            migrationBuilder.RenameTable(
                name: "todo_skill",
                newName: "TodoSkill");

            migrationBuilder.RenameColumn(
                name: "rewards",
                table: "Todos",
                newName: "Rewards");

            migrationBuilder.RenameColumn(
                name: "priority",
                table: "Todos",
                newName: "Priority");

            migrationBuilder.RenameColumn(
                name: "notes",
                table: "Todos",
                newName: "Notes");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Todos",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Todos",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "deleted",
                table: "Todos",
                newName: "Deleted");

            migrationBuilder.RenameColumn(
                name: "complexity",
                table: "Todos",
                newName: "Complexity");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Todos",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "todo_status",
                table: "Todos",
                newName: "TodoStatus");

            migrationBuilder.RenameColumn(
                name: "start_date",
                table: "Todos",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "spent_time",
                table: "Todos",
                newName: "SpentTime");

            migrationBuilder.RenameColumn(
                name: "previous_todo_id",
                table: "Todos",
                newName: "PreviousTodoId");

            migrationBuilder.RenameColumn(
                name: "parent_todo_id",
                table: "Todos",
                newName: "ParentTodoId");

            migrationBuilder.RenameColumn(
                name: "next_todo_id",
                table: "Todos",
                newName: "NextTodoId");

            migrationBuilder.RenameColumn(
                name: "modified_by",
                table: "Todos",
                newName: "ModifiedBy");

            migrationBuilder.RenameColumn(
                name: "modified_at",
                table: "Todos",
                newName: "ModifiedAt");

            migrationBuilder.RenameColumn(
                name: "is_completed",
                table: "Todos",
                newName: "IsCompleted");

            migrationBuilder.RenameColumn(
                name: "estimated_time",
                table: "Todos",
                newName: "EstimatedTime");

            migrationBuilder.RenameColumn(
                name: "end_date",
                table: "Todos",
                newName: "EndDate");

            migrationBuilder.RenameColumn(
                name: "earliest_start_date",
                table: "Todos",
                newName: "EarliestStartDate");

            migrationBuilder.RenameColumn(
                name: "due_date",
                table: "Todos",
                newName: "DueDate");

            migrationBuilder.RenameColumn(
                name: "creation_status",
                table: "Todos",
                newName: "CreationStatus");

            migrationBuilder.RenameColumn(
                name: "created_by",
                table: "Todos",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Todos",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "completed_date",
                table: "Todos",
                newName: "CompletedDate");

            migrationBuilder.RenameColumn(
                name: "child_todo_id",
                table: "Todos",
                newName: "ChildTodoId");

            migrationBuilder.RenameColumn(
                name: "prevalence",
                table: "Skills",
                newName: "Prevalence");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Skills",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Skills",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "deleted",
                table: "Skills",
                newName: "Deleted");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Skills",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "modified_by",
                table: "Skills",
                newName: "ModifiedBy");

            migrationBuilder.RenameColumn(
                name: "modified_at",
                table: "Skills",
                newName: "ModifiedAt");

            migrationBuilder.RenameColumn(
                name: "created_by",
                table: "Skills",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Skills",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "todo_id",
                table: "TodoSkill",
                newName: "TodoId");

            migrationBuilder.RenameColumn(
                name: "skill_id",
                table: "TodoSkill",
                newName: "SkillId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Skills",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Todos",
                table: "Todos",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Skills",
                table: "Skills",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TodoSkill",
                table: "TodoSkill",
                columns: new[] { "SkillId", "TodoId" });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    ProviderKey = table.Column<string>(type: "text", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    RoleId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Todos_Todos_ChildTodoId",
                table: "Todos",
                column: "ChildTodoId",
                principalTable: "Todos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Todos_Todos_NextTodoId",
                table: "Todos",
                column: "NextTodoId",
                principalTable: "Todos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Todos_Todos_ParentTodoId",
                table: "Todos",
                column: "ParentTodoId",
                principalTable: "Todos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Todos_Todos_PreviousTodoId",
                table: "Todos",
                column: "PreviousTodoId",
                principalTable: "Todos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TodoSkill_Skills_SkillId",
                table: "TodoSkill",
                column: "SkillId",
                principalTable: "Skills",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TodoSkill_Todos_TodoId",
                table: "TodoSkill",
                column: "TodoId",
                principalTable: "Todos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Todos_Todos_ChildTodoId",
                table: "Todos");

            migrationBuilder.DropForeignKey(
                name: "FK_Todos_Todos_NextTodoId",
                table: "Todos");

            migrationBuilder.DropForeignKey(
                name: "FK_Todos_Todos_ParentTodoId",
                table: "Todos");

            migrationBuilder.DropForeignKey(
                name: "FK_Todos_Todos_PreviousTodoId",
                table: "Todos");

            migrationBuilder.DropForeignKey(
                name: "FK_TodoSkill_Skills_SkillId",
                table: "TodoSkill");

            migrationBuilder.DropForeignKey(
                name: "FK_TodoSkill_Todos_TodoId",
                table: "TodoSkill");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Todos",
                table: "Todos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Skills",
                table: "Skills");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TodoSkill",
                table: "TodoSkill");

            migrationBuilder.RenameTable(
                name: "Todos",
                newName: "todos");

            migrationBuilder.RenameTable(
                name: "Skills",
                newName: "skills");

            migrationBuilder.RenameTable(
                name: "TodoSkill",
                newName: "todo_skill");

            migrationBuilder.RenameColumn(
                name: "Rewards",
                table: "todos",
                newName: "rewards");

            migrationBuilder.RenameColumn(
                name: "Priority",
                table: "todos",
                newName: "priority");

            migrationBuilder.RenameColumn(
                name: "Notes",
                table: "todos",
                newName: "notes");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "todos",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "todos",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Deleted",
                table: "todos",
                newName: "deleted");

            migrationBuilder.RenameColumn(
                name: "Complexity",
                table: "todos",
                newName: "complexity");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "todos",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "TodoStatus",
                table: "todos",
                newName: "todo_status");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "todos",
                newName: "start_date");

            migrationBuilder.RenameColumn(
                name: "SpentTime",
                table: "todos",
                newName: "spent_time");

            migrationBuilder.RenameColumn(
                name: "PreviousTodoId",
                table: "todos",
                newName: "previous_todo_id");

            migrationBuilder.RenameColumn(
                name: "ParentTodoId",
                table: "todos",
                newName: "parent_todo_id");

            migrationBuilder.RenameColumn(
                name: "NextTodoId",
                table: "todos",
                newName: "next_todo_id");

            migrationBuilder.RenameColumn(
                name: "ModifiedBy",
                table: "todos",
                newName: "modified_by");

            migrationBuilder.RenameColumn(
                name: "ModifiedAt",
                table: "todos",
                newName: "modified_at");

            migrationBuilder.RenameColumn(
                name: "IsCompleted",
                table: "todos",
                newName: "is_completed");

            migrationBuilder.RenameColumn(
                name: "EstimatedTime",
                table: "todos",
                newName: "estimated_time");

            migrationBuilder.RenameColumn(
                name: "EndDate",
                table: "todos",
                newName: "end_date");

            migrationBuilder.RenameColumn(
                name: "EarliestStartDate",
                table: "todos",
                newName: "earliest_start_date");

            migrationBuilder.RenameColumn(
                name: "DueDate",
                table: "todos",
                newName: "due_date");

            migrationBuilder.RenameColumn(
                name: "CreationStatus",
                table: "todos",
                newName: "creation_status");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "todos",
                newName: "created_by");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "todos",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "CompletedDate",
                table: "todos",
                newName: "completed_date");

            migrationBuilder.RenameColumn(
                name: "ChildTodoId",
                table: "todos",
                newName: "child_todo_id");

            migrationBuilder.RenameColumn(
                name: "Prevalence",
                table: "skills",
                newName: "prevalence");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "skills",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "skills",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Deleted",
                table: "skills",
                newName: "deleted");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "skills",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "ModifiedBy",
                table: "skills",
                newName: "modified_by");

            migrationBuilder.RenameColumn(
                name: "ModifiedAt",
                table: "skills",
                newName: "modified_at");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "skills",
                newName: "created_by");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "skills",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "TodoId",
                table: "todo_skill",
                newName: "todo_id");

            migrationBuilder.RenameColumn(
                name: "SkillId",
                table: "todo_skill",
                newName: "skill_id");

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
                name: "pk_todos",
                table: "todos",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_skills",
                table: "skills",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_todo_skill",
                table: "todo_skill",
                columns: new[] { "skill_id", "todo_id" });

            migrationBuilder.AddForeignKey(
                name: "fk_todo_skill_skills_skill_id",
                table: "todo_skill",
                column: "skill_id",
                principalTable: "skills",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_todo_skill_todos_todo_id",
                table: "todo_skill",
                column: "todo_id",
                principalTable: "todos",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

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
    }
}
