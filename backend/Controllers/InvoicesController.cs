using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.Data;
using BerAuto.Backend.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Ide is kell a védelem, csak bejelentkezve használható
    public class InvoicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InvoicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Ügyintéző számlát állít ki egy BEFEJEZETT bérlésből
        [Authorize(Roles = "Agent, Admin")]
        [HttpPost("create/{rentalId}")]
        public async Task<IActionResult> CreateInvoice(int rentalId)
        {
            var rental = await _context.Rentals.FindAsync(rentalId);
            if (rental == null) return NotFound("Bérlés nem található.");

            // Csak befejezett bérlésre lehet számlát kiállítani
            if (rental.Status != RentalStatus.Completed)
            {
                return BadRequest("Csak befejezett (Completed) bérlésből lehet számlát kiállítani.");
            }

            // Ellenőrizzük, van-e már számla ehhez a bérléshez, nehogy duplán számlázzunk
            bool invoiceExists = await _context.Invoices.AnyAsync(i => i.RentalId == rentalId);
            if (invoiceExists)
            {
                return BadRequest("Ehhez a bérléshez már készült számla.");
            }

            // Számla entitás létrehozása
            var invoice = new Invoice
            {
                RentalId = rental.Id,
                TotalAmount = rental.TotalCost, // A bérlésnél kiszámolt teljes ár
                IssuedAt = DateTime.Now,
                IsPaid = false // Alapértelmezetten még nincs kifizetve
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Számla sikeresen kiállítva!", invoiceId = invoice.Id });
        }

        // 2. A sima felhasználó lekéri a SAJÁT számláit
        [HttpGet("my-invoices")]
        public async Task<IActionResult> GetMyInvoices()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
            {
                return Unauthorized();
            }

            var invoices = await _context.Invoices
                .Include(i => i.Rental)
                    .ThenInclude(r => r.Car) // Behúzzuk az autót is, hogy látszódjon a számlán
                .Where(i => i.Rental!.UserId == userId)
                .ToListAsync();

            return Ok(invoices);
        }

        // 3. Számla kifizetése (pl. a fizetési kapu után hívja meg a frontend)
        [HttpPut("{id}/pay")]
        public async Task<IActionResult> PayInvoice(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound("Számla nem található.");

            if (invoice.IsPaid) return BadRequest("Ez a számla már ki van fizetve.");

            invoice.IsPaid = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Számla sikeresen kifizetve!" });
        }
        // GET: api/Invoices/{id}/download
        [HttpGet("{id}/download")]
        [AllowAnonymous] // Most ideiglenesen levesszük a lakatot, hogy a böngészőből könnyen letölthető legyen
        public async Task<IActionResult> DownloadInvoicePdf(int id)
        {
            // Lekérjük a számlát minden kapcsolódó adattal (Bérlés, Autó, User)
            var invoice = await _context.Invoices
                .Include(i => i.Rental)
                    .ThenInclude(r => r.Car)
                .Include(i => i.Rental!.User)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null) return NotFound("Számla nem található.");

            // Megnézzük, hogy regisztrált user vagy vendég bérelte-e
            string customerName = invoice.Rental!.UserId != null
                ? invoice.Rental.User!.Username
                : invoice.Rental.GuestName ?? "Ismeretlen ügyfél";

            // --- PDF DOKUMENTUM FELÉPÍTÉSE ---
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    // Fejléc
                    page.Header().Row(row =>
                    {
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text("SZÁMLA").SemiBold().FontSize(36).FontColor(Colors.Blue.Darken2);
                            col.Item().Text($"Számlaszám: #INV-{invoice.Id:0000}").FontSize(14);
                            col.Item().Text($"Kiállítva: {invoice.IssuedAt:yyyy.MM.dd}").FontSize(14);
                        });
                    });

                    // Tartalom
                    page.Content().PaddingVertical(1, Unit.Centimetre).Column(column =>
                    {
                        // Ügyfél adatok
                        column.Item().Text("Vevő adatai:").SemiBold().FontSize(16);
                        column.Item().Text(customerName);
                        column.Item().PaddingBottom(1, Unit.Centimetre);

                        // Tételes lista (Táblázat)
                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(3); // Megnevezés oszlop
                                columns.RelativeColumn(1); // Napok száma
                                columns.RelativeColumn(1); // Ár
                            });

                            // Táblázat fejléce
                            table.Header(header =>
                            {
                                header.Cell().BorderBottom(1).Padding(2).Text("Megnevezés").SemiBold();
                                header.Cell().BorderBottom(1).Padding(2).Text("Időtartam").SemiBold();
                                header.Cell().BorderBottom(1).Padding(2).Text("Összesen").SemiBold().AlignRight();
                            });

                            // Táblázat sora (A bérlés adatai)
                            int rentedDays = (invoice.Rental.EndDate - invoice.Rental.StartDate).Days;
                            if (rentedDays == 0) rentedDays = 1; // Minimum 1 nap

                            table.Cell().Padding(2).Text($"Autóbérlés: {invoice.Rental.Car!.Brand} ({invoice.Rental.Car.LicensePlate})");
                            table.Cell().Padding(2).Text($"{rentedDays} nap");
                            table.Cell().Padding(2).Text($"{invoice.TotalAmount} Ft").AlignRight();
                        });

                        // Végösszeg
                        column.Item().PaddingTop(20).AlignRight().Text($"Fizetendő végösszeg: {invoice.TotalAmount} Ft")
                            .SemiBold().FontSize(20);

                        // Státusz
                        string statusText = invoice.IsPaid ? "KIFIZETVE" : "NINCS KIFIZETVE";
                        string statusColor = invoice.IsPaid ? Colors.Green.Medium : Colors.Red.Medium;

                        column.Item().PaddingTop(10).AlignRight().Text(statusText)
                            .SemiBold().FontSize(16).FontColor(statusColor);
                    });

                    // Lábjegyzet
                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.Span("Oldalszám: ");
                        x.CurrentPageNumber();
                        x.Span(" / ");
                        x.TotalPages();
                    });
                });
            });

            // PDF generálása memóriába
            byte[] pdfBytes = document.GeneratePdf();

            // Fájl visszaküldése letöltésre
            return File(pdfBytes, "application/pdf", $"Szamla_{invoice.Id}.pdf");
        }
    }
}