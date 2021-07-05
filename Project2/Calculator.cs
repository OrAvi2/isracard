using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project2
{
    public class Calculator
    {
        public decimal Number1 { get; set; }
        public decimal Number2 { get; set; }

        public virtual decimal GetResult()
        {
            return -999999;
        }

    }

    public class CalculatAddition : Calculator
    {
        public override decimal GetResult()
        {
            return Number1 + Number2;
        }
    }


    public class CalculatSubtraction : Calculator
    {
        public override decimal GetResult()
        {
            return Number1 - Number2;
        }
    }


    public class CalculatDivision : Calculator
    {
        public override decimal GetResult()
        {
            return Number1 / Number2;
        }
    }

    public class CalculatMultiplication : Calculator
    {
        public override decimal GetResult()
        {
            return Number1 * Number2;
        }
    }



}
