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

        //Számla kifizetése
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
        [AllowAnonymous]
        public async Task<IActionResult> DownloadInvoicePdf(int id)
        {

            var invoice = await _context.Invoices
                .Include(i => i.Rental)
                    .ThenInclude(r => r.Car)
                .Include(i => i.Rental!.User)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null) return NotFound("Számla nem található.");

            // Ügyfél adatainak meghatározása
            string customerName = invoice.Rental!.UserId != null ? invoice.Rental.User!.Username : invoice.Rental.GuestName ?? "Ismeretlen ügyfél";
            string customerAddress = invoice.Rental.User?.Address ?? "Nincs megadva";

            // Időtartam számítása
            int rentedDays = (invoice.Rental.EndDate.Date - invoice.Rental.StartDate.Date).Days;
            if (rentedDays <= 0) rentedDays = 1; // Minimum 1 napot számlázunk

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(1, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Verdana));

                    //FEJLÉC
                    page.Header().Column(col =>
                    {
                        col.Item().Row(row =>
                        {
                            row.ConstantItem(60).Height(60).Background(Colors.Blue.Medium).AlignCenter().AlignMiddle()
                                .Text("B").FontSize(30).FontColor(Colors.White).SemiBold();

                            row.RelativeItem().PaddingLeft(10).Column(c =>
                            {
                                c.Item().Text("BerAuto Kft.").SemiBold().FontSize(12);
                                c.Item().Text("1111 Budapest, Autó út 10.");
                                c.Item().Text("Adószám: 12345678-1-11");
                            });

                            row.RelativeItem().AlignRight().Column(c =>
                            {
                                c.Item().Text("ELEKTRONIKUS SZÁMLA").FontSize(20).SemiBold();
                                c.Item().PaddingTop(5).Text($"Sorszám: E-BA-{invoice.IssuedAt.Year}-{invoice.Id:0000}");
                            });
                        });
                        col.Item().PaddingVertical(5).LineHorizontal(2).LineColor(Colors.Blue.Medium);
                    });

                    page.Content().Column(column =>
                    {
                        column.Item().Row(row =>
                        {
                            row.RelativeItem().Column(c =>
                            {
                                c.Item().Text("VEVŐ:").SemiBold();
                                c.Item().Text(customerName).FontSize(12).SemiBold();
                                c.Item().Text(customerAddress);
                                c.Item().Text(invoice.Rental.User?.PhoneNumber ?? "");
                            });

                            row.RelativeItem().Table(table =>
                            {
                                table.ColumnsDefinition(c => { c.RelativeColumn(); c.RelativeColumn(); });
                                table.Cell().Text("Fizetési mód:");
                                table.Cell().AlignRight().Text("Átutalás");
                                table.Cell().Text("Kiállítás dátuma:");
                                table.Cell().AlignRight().Text($"{invoice.IssuedAt:yyyy.MM.dd}.");
                                table.Cell().Background(Colors.Blue.Medium).Padding(2).Text("Fizetési határidő:").FontColor(Colors.White).SemiBold();
                                table.Cell().Background(Colors.Blue.Medium).Padding(2).AlignRight().Text($"{invoice.IssuedAt.AddDays(8):yyyy.MM.dd}.").FontColor(Colors.White).SemiBold();
                            });
                        });

                        column.Item().PaddingTop(20).Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn(4); // Szolgáltatás megnevezése
                                c.RelativeColumn(2); // Időszak (Mettől-meddig)
                                c.RelativeColumn(1); // Napok
                                c.RelativeColumn(1.5f); // Napi díj
                                c.RelativeColumn(1.5f); // Bruttó érték
                            });

                            table.Header(h =>
                            {
                                h.Cell().Text("Szolgáltatás megnevezése").SemiBold();
                                h.Cell().AlignCenter().Text("Bérleti időszak").SemiBold();
                                h.Cell().AlignCenter().Text("Napok").SemiBold();
                                h.Cell().AlignRight().Text("Egységár (nap)").SemiBold();
                                h.Cell().AlignRight().Text("Bruttó ár").SemiBold();
                                h.Cell().Element(x => x.PaddingVertical(5).BorderBottom(1));
                            });

                            // Tétel sor kitöltése az adatbázisból
                            var car = invoice.Rental.Car!;
                            table.Cell().PaddingVertical(5).Column(c => {
                                c.Item().Text($"Gépjármű bérlés: {car.Brand}").SemiBold();
                                c.Item().Text($"Rendszám: {car.LicensePlate}").FontSize(9).Italic();
                            });

                            table.Cell().AlignCenter().PaddingVertical(5).Text($"{invoice.Rental.StartDate:yyyy.MM.dd} - {invoice.Rental.EndDate:yyyy.MM.dd}");
                            table.Cell().AlignCenter().PaddingVertical(5).Text($"{rentedDays} nap");
                            table.Cell().AlignRight().PaddingVertical(5).Text($"{car.DailyRate:N0} Ft");
                            table.Cell().AlignRight().PaddingVertical(5).Text($"{invoice.TotalAmount:N0} Ft");
                        });

                        // --- ÖSSZESÍTÉS ---
                        column.Item().PaddingTop(30).AlignRight().Column(c =>
                        {
                            c.Item().Text($"Fizetendő összesen: {invoice.TotalAmount:N0} Ft").FontSize(18).SemiBold().FontColor(Colors.Blue.Medium);
                            c.Item().PaddingTop(5).Text(invoice.IsPaid ? "KIFIZETVE" : "ÁTUTALÁSRA VÁR").FontColor(invoice.IsPaid ? Colors.Green.Medium : Colors.Red.Medium).SemiBold();
                        });

                        if (!invoice.IsPaid)
                        {
                            column.Item().PaddingTop(10).Text("Kérjük, az utalás közlemény rovatában tüntesse fel a számla sorszámát!").FontSize(8).Italic();
                        }
                    });

                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.Span("Oldal: ");
                        x.CurrentPageNumber();
                        x.Span(" / ");
                        x.TotalPages();
                    });
                });
            });

            byte[] pdfBytes = document.GeneratePdf();
            return File(pdfBytes, "application/pdf", $"BA_Szamla_{invoice.Id}.pdf");
        }
    }
}