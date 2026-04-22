using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class FixExistingModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "_ac",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "_brand",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "_doors",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "_engine",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "_fuelConsumption",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "_fuelType",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "_kilometer",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "_ownWeight",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "_passengerCapacity",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "_performance",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "_torque",
                table: "Cars");

            migrationBuilder.RenameColumn(
                name: "_trunkCapacity",
                table: "Cars",
                newName: "PassengerCapacity");

            migrationBuilder.RenameColumn(
                name: "_transmission",
                table: "Cars",
                newName: "LicensePlate");

            migrationBuilder.RenameColumn(
                name: "_technicalNotes",
                table: "Cars",
                newName: "Transmission");

            migrationBuilder.RenameColumn(
                name: "_licensePlate",
                table: "Cars",
                newName: "Brand");

            migrationBuilder.RenameColumn(
                name: "_isAvailable",
                table: "Cars",
                newName: "IsAvailable");

            migrationBuilder.RenameColumn(
                name: "_dailyRate",
                table: "Cars",
                newName: "DailyRate");

            migrationBuilder.RenameColumn(
                name: "_id",
                table: "Cars",
                newName: "Id");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Cars",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FuelType",
                table: "Cars",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Cars",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "FuelType",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Cars");

            migrationBuilder.RenameColumn(
                name: "Transmission",
                table: "Cars",
                newName: "_technicalNotes");

            migrationBuilder.RenameColumn(
                name: "PassengerCapacity",
                table: "Cars",
                newName: "_trunkCapacity");

            migrationBuilder.RenameColumn(
                name: "LicensePlate",
                table: "Cars",
                newName: "_transmission");

            migrationBuilder.RenameColumn(
                name: "IsAvailable",
                table: "Cars",
                newName: "_isAvailable");

            migrationBuilder.RenameColumn(
                name: "DailyRate",
                table: "Cars",
                newName: "_dailyRate");

            migrationBuilder.RenameColumn(
                name: "Brand",
                table: "Cars",
                newName: "_licensePlate");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Cars",
                newName: "_id");

            migrationBuilder.AddColumn<bool>(
                name: "_ac",
                table: "Cars",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "_brand",
                table: "Cars",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "_doors",
                table: "Cars",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "_engine",
                table: "Cars",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "_fuelConsumption",
                table: "Cars",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "_fuelType",
                table: "Cars",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "_kilometer",
                table: "Cars",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "_ownWeight",
                table: "Cars",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "_passengerCapacity",
                table: "Cars",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "_performance",
                table: "Cars",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "_torque",
                table: "Cars",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
