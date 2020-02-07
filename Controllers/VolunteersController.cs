using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BridgeHospiceApi.Data;
using BridgeHospiceApi.Models;
using BridgeHospiceApi.Services;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace BridgeHospiceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VolunteersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailSender _emailSender;
        //private readonly ISmsSender _smsSender;
        //private readonly ILogger _logger;

        public VolunteersController(ApplicationDbContext context, IEmailSender emailSender, ISmsSender smsSender, ILoggerFactory loggerFactory)
        {
            _context = context;
            _emailSender = emailSender;
            //_smsSender = smsSender;
            //_logger = loggerFactory.CreateLogger<VolunteersController>();
        }

        // GET: api/Volunteers
        [HttpGet]
        private async Task<ActionResult<IEnumerable<Volunteer>>> GetTemplates()
        {
            return await _context.Volunteers.ToListAsync();
        }

        // GET: api/Volunteers/5
        [HttpGet("{id}")]
        private async Task<ActionResult<Volunteer>> GetVolunteer(int id)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);

            if (volunteer == null)
            {
                return NotFound();
            }

            return volunteer;
        }

        // PUT: api/Volunteers/5
        [HttpPut("{id}")]
        private async Task<IActionResult> PutVolunteer(int id, Volunteer volunteer)
        {
            if (id != volunteer.VolunteerID)
            {
                return BadRequest();
            }

            _context.Entry(volunteer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VolunteerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Volunteers
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<Volunteer>> PostVolunteer(Volunteer volunteer)
        {
            _context.Volunteers.Add(volunteer);
            await _context.SaveChangesAsync();

            var appUser = new ApplicationUser() {
                FirstName = volunteer.FirstName,
                LastName = volunteer.LastName,
                Email = volunteer.Email,
            };

            await _emailSender.SendEmailAsync(appUser, "Your volunteer application was submitted", 
                $"Hello {volunteer.FirstName} {volunteer.LastName},<br><br>" +
                $"Your volunteer application was submitted.<br><br>" +
                $"Please allow 3-5 business days for our staff to process your request.<br>" +
                $"Our office hours are 9:00am to 5:00pm Monday through Friday.<br>" +
                $"For further assistance contact us at (806) 993-3900 or support@bridge-hospice.com"
            );

            return CreatedAtAction("GetVolunteer", new { id = volunteer.VolunteerID }, volunteer);
        }

        // DELETE: api/Volunteers/5
        [HttpDelete("{id}")]
        private async Task<ActionResult<Volunteer>> DeleteVolunteer(int id)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);
            if (volunteer == null)
            {
                return NotFound();
            }

            _context.Volunteers.Remove(volunteer);
            await _context.SaveChangesAsync();

            return volunteer;
        }

        private bool VolunteerExists(int id)
        {
            return _context.Volunteers.Any(e => e.VolunteerID == id);
        }
        
    }
}
