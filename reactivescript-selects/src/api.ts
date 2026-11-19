// A pretend server: each answer takes half a second.
const countryStates: Record<string, string[]> = {
  Canada: ["British Columbia", "Ontario", "Quebec"],
  "United States": ["California", "Florida", "New York", "Texas", "Utah"],
};

const stateCities: Record<string, string[]> = {
  Utah: ["Salt Lake City", "Provo", "West Valley City"],
  California: ["Los Angeles", "San Francisco", "San Diego"],
  Texas: ["Houston", "Dallas", "Austin"],
  Florida: ["Miami", "Orlando", "Tampa"],
  "New York": ["New York City", "Buffalo", "Rochester"],
  "British Columbia": ["Vancouver", "Victoria", "Kamloops"],
  Ontario: ["Toronto", "Ottawa", "Hamilton"],
  Quebec: ["Montreal", "Quebec City", "Gatineau"],
};

const wait = () => new Promise((resolve) => setTimeout(resolve, 500));

export async function getCountries(): Promise<string[]> {
  await wait();
  return Object.keys(countryStates);
}

export async function getStates(country: string): Promise<string[]> {
  await wait();
  return countryStates[country] ?? [];
}

export async function getCities(state: string): Promise<string[]> {
  await wait();
  return stateCities[state] ?? [];
}
