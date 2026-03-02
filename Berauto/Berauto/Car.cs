namespace Berauto
{
    public class Car
    {
        public string _engine {  get; set; }
        public string _fuelType { get; set; }
        public int _performance {  get; set; } //HP
        public int _torque { get; set; } //Nm
        public double _fuelConsumption { get; set; } // l/100km
        public string _transmission { get; set; } // The car is: manual/ electric - 5 speed, 4 speed etc 
        public bool _ac { get; set; }
        public int _doors { get; set; }

    }
}
