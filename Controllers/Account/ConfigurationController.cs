using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BridgeHospiceApi.Controllers
{
    //[EnableCors("Origins")]
    [Route("Api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class ConfigurationController : Controller
    {
        private readonly ILogger<ConfigurationController> _logger;

        public ConfigurationController(IClientRequestParametersProvider clientRequestParametersProvider, ILogger<ConfigurationController> logger)
        {
            ClientRequestParametersProvider = clientRequestParametersProvider;
            _logger = logger;
        }

        public IClientRequestParametersProvider ClientRequestParametersProvider { get; }

        [HttpGet("{clientId}")]
        public IActionResult GetClientRequestParameters([FromRoute]string clientId)
        {
            _logger.LogInformation($"Client request parameters attempt from {clientId}");
            var parameters = ClientRequestParametersProvider.GetClientParameters(HttpContext, clientId);
            return Ok(parameters);
        }
    }
}
