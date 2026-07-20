const vehiclePricing = {
  "luxury-sedan": {
    label: "Luxury Sedan",
    baseFare: 65,
    perKm: 3.2,
    hourlyRate: 95,
    minimumHours: 2,
    seats: 3,
    luggage: 2,
  },
  "luxury-suv": {
    label: "Luxury SUV",
    baseFare: 95,
    perKm: 4.4,
    hourlyRate: 125,
    minimumHours: 2,
    seats: 6,
    luggage: 5,
  },
  "premium-suv": {
    label: "Premium SUV",
    baseFare: 135,
    perKm: 5.6,
    hourlyRate: 165,
    minimumHours: 3,
    seats: 5,
    luggage: 5,
  },
  "premium-sedan": {
    label: "Premium Sedan",
    baseFare: 145,
    perKm: 5.4,
    hourlyRate: 175,
    minimumHours: 3,
    seats: 3,
    luggage: 2,
  },
  "sprinter-van": {
    label: "Sprinter Van",
    baseFare: 195,
    perKm: 7.4,
    hourlyRate: 225,
    minimumHours: 4,
    seats: 14,
    luggage: 14,
  },
  "executive-coach": {
    label: "Executive Coach",
    baseFare: 425,
    perKm: 11.5,
    hourlyRate: 395,
    minimumHours: 5,
    seats: 56,
    luggage: 56,
  },
};

const serviceSurcharges = {
  airport: 25,
  "point-to-point": 0,
  hourly: 0,
  corporate: 35,
  event: 60,
  "city-tour": 45,
};

const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const isLateNight = (time = "") => {
  const hour = Number(String(time).split(":")[0]);
  return Number.isFinite(hour) && (hour >= 22 || hour < 6);
};

export const getVehicleCatalog = () =>
  Object.entries(vehiclePricing).map(([id, details]) => ({ id, ...details }));

export const calculateQuote = (input) => {
  const vehicle = vehiclePricing[input.vehicleType];
  if (!vehicle) throw new Error("Selected vehicle is not available.");

  const distanceKm = Math.max(Number(input.distanceKm || 0), 0);
  const durationHours = Math.max(Number(input.durationHours || 0), 0);
  const serviceType = input.serviceType || "point-to-point";
  const isHourly = serviceType === "hourly";

  const baseFare = isHourly ? 0 : vehicle.baseFare;
  const distanceCharge = isHourly ? 0 : distanceKm * vehicle.perKm;
  const billableHours = isHourly
    ? Math.max(durationHours || vehicle.minimumHours, vehicle.minimumHours)
    : 0;
  const hourlyCharge = isHourly ? billableHours * vehicle.hourlyRate : 0;

  let surcharges = serviceSurcharges[serviceType] || 0;
  const subtotalBeforeSurcharges = baseFare + distanceCharge + hourlyCharge;

  if (isLateNight(input.pickupTime)) {
    surcharges += subtotalBeforeSurcharges * 0.15;
  }

  if (input.returnTrip) {
    surcharges += subtotalBeforeSurcharges * 0.85;
  }

  const total = Math.max(subtotalBeforeSurcharges + surcharges, vehicle.baseFare);

  return {
    vehicleLabel: vehicle.label,
    baseFare: roundMoney(baseFare),
    distanceCharge: roundMoney(distanceCharge),
    hourlyCharge: roundMoney(hourlyCharge),
    surcharges: roundMoney(surcharges),
    total: roundMoney(total),
    currency: "USD",
    billableHours,
    note:
      "This is an estimated fare. Tolls, parking, waiting time, and route changes may be adjusted before final confirmation.",
  };
};
