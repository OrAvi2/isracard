using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Reflection;

namespace Project2.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CalculatorController : ControllerBase
    {

        [HttpGet]
        public decimal Get(string operation,string number1,string number2)
        {
            var type = typeof(Calculator).Assembly
                                    .GetTypes()
                                    .Single(t => t.Name == "Calculat" + operation);
            var o = (Calculator)Activator.CreateInstance(type);
            o.Number1 = decimal.Parse(number1);
            o.Number2 = decimal.Parse(number2);
            return o.GetResult();

        }

    }
}
