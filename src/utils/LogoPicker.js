import { teamsData } from "../assets/data/teams";

// const logoMap = Object.values(teams).flatMap(conferences =>
//   Object.values(conferences).flatMap(teams =>
//     teams.reduce((acc, team) => {
//       acc[team.id] = team.logoUrl;
//       return acc;
//     }, {})
//   )
// );

// export const createLogoLookup = () => {
//     return Object.values(teams).flatMap(conferences =>
//       Object.values(conferences).flatMap(teams =>
//         teams.reduce((acc, team) => {
//           acc[team.id] = team.logoUrl;
//           return acc;
//         }, {})
//       )
//     );
//   };
  
//   // Create the logo map
//   export const logoMap = createLogoLookup();

const allTeams = Object.values(teamsData.East)
  .concat(Object.values(teamsData.West))
  .flat();

// Create a map for quick lookup by team ID
const teamMap = new Map(allTeams.map((team) => [team.id, team]));

// Helper function to get logo URL by team ID
export const getTeamLogoUrl = (teamId) => {
  const team = teamMap.get(teamId);
  return team ? team.logoUrl : "/assets/logos/default-logo.svg"; // Fallback for missing logos
};

export const getTeamCode = (teamId) => {
    const team = teamMap.get(teamId);
    return team ? team.code : "TEAM"; // Fallback for missing logos
  };