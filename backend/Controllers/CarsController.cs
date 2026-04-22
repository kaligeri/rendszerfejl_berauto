using backend.Services;
using BerAuto.Backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarsController : ControllerBase
    {
        private readonly ICarService _carService;

        public CarsController(ICarService carService)
        {
            _carService = carService;
        }

        [Authorize]
        //Összes autó lekérése (GET: api/cars)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Car>>> GetAll()
        {
            return Ok(await _carService.GetAllAsync());
        }

        //Egy autó lekérése ID alapján (GET: api/cars/5)
        [HttpGet("{id}")]
        public async Task<ActionResult<Car>> Get(int id)
        {
            var car = await _carService.GetByIdAsync(id);
            if (car == null) return NotFound("Az autó nem található.");
            return Ok(car);
        }

        //Új autó hozzáadása (POST: api/cars)
        [HttpPost]
        public async Task<ActionResult<Car>> Create(Car car)
        {
            var created = await _carService.CreateAsync(car);
            // Visszaküldjük a 201 Created státuszt és a létrehozott autót
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        //Autó adatainak frissítése (PUT: api/cars/5)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Car car)
        {
            var success = await _carService.UpdateAsync(id, car);
            if (!success) return NotFound();
            return NoContent();
        }

        //Autó törlése (DELETE: api/cars/5)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _carService.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

    }
}
