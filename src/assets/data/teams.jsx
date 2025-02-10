export const teamsData = {
    East: {
        "Atlantic": [
            {
                "id": 2,
                "name": "Boston Celtics",
                "logoUrl": "/assets/logos/Boston Celtics.svg",
                "code": "BOS"
            },
            {
                "id": 4,
                "name": "Brooklyn Nets",
                "logoUrl": "/assets/logos/Brooklyn Nets.svg",
                "code": "BKN"
            },
            {
                "id": 24,
                "name": "New York Knicks",
                "logoUrl": "/assets/logos/New York Knicks.svg",
                "code": "NYK"
            },
            {
                "id": 27,
                "name": "Philadelphia 76ers",
                "logoUrl": "/assets/logos/Philadelphia 76ers.svg",
                "code": "PHI"
            },
            {
                "id": 38,
                "name": "Toronto Raptors",
                "logoUrl": "/assets/logos/Toronto Raptors.svg",
                "code": "TOR"
            }
        ],
        "Central": [
            {
                "id": 6,
                "name": "Chicago Bulls",
                "logoUrl": "/assets/logos/Chicago Bulls.svg",
                "code": "CHI"
            },
            {
                "id": 7,
                "name": "Cleveland Cavaliers",
                "logoUrl": "/assets/logos/Cleveland Cavaliers.svg",
                "code": "CLE"
            },
            {
                "id": 10,
                "name": "Detroit Pistons",
                "logoUrl": "/assets/logos/Detroit Pistons.svg",
                "code": "DET"
            },
            {
                "id": 15,
                "name": "Indiana Pacers",
                "logoUrl": "/assets/logos/Indiana Pacers.svg",
                "code": "IND"
            },
            {
                "id": 21,
                "name": "Milwaukee Bucks",
                "logoUrl": "/assets/logos/Milwaukee Bucks.svg",
                "code": "MIL"
            }
        ],
        "Southeast": [
            {
                "id": 1,
                "name": "Atlanta Hawks",
                "logoUrl": "/assets/logos/Atlanta Hawks.svg",
                "code": "ATL"
            },
            {
                "id": 5,
                "name": "Charlotte Hornets",
                "logoUrl": "/assets/logos/Charlotte Hornets.svg",
                "code": "CHA"
            },
            {
                "id": 20,
                "name": "Miami Heat",
                "logoUrl": "/assets/logos/Miami Heat.svg",
                "code": "MIA"
            },
            {
                "id": 26,
                "name": "Orlando Magic",
                "logoUrl": "/assets/logos/Orlando Magic.svg",
                "code": "ORL"
            },
            {
                "id": 41,
                "name": "Washington Wizards",
                "logoUrl": "/assets/logos/Washington Wizards.svg",
                "code": "WAS"
            }
        ]
    },
    West: {
        "Northwest": [
            {
                "id": 9,
                "name": "Denver Nuggets",
                "logoUrl": "/assets/logos/Denver Nuggets.svg",
                "code": "DEN"
            },
            {
                "id": 22,
                "name": "Minnesota Timberwolves",
                "logoUrl": "/assets/logos/Minnesota Timberwolves.svg",
                "code": "MIN"
            },
            {
                "id": 25,
                "name": "Oklahoma City Thunder",
                "logoUrl": "/assets/logos/Oklahoma City Thunder.svg",
                "code": "OKC"
            },
            {
                "id": 29,
                "name": "Portland Trail Blazers",
                "logoUrl": "/assets/logos/Portland Trail Blazers.svg",
                "code": "POR"
            },
            {
                "id": 40,
                "name": "Utah Jazz",
                "logoUrl": "/assets/logos/Utah Jazz.svg",
                "code": "UTA"
            }
        ],
        "Pacific": [
            {
                "id": 11,
                "name": "Golden State Warriors",
                "logoUrl": "/assets/logos/Golden State Warriors.svg",
                "code": "GSW"
            },
            {
                "id": 16,
                "name": "Los Angeles Clippers",
                "logoUrl": "/assets/logos/Los Angeles Clippers.svg",
                "code": "LAC"
            },
            {
                "id": 17,
                "name": "Los Angeles Lakers",
                "logoUrl": "/assets/logos/Los Angeles Lakers.svg",
                "code": "LAL"
            },
            {
                "id": 28,
                "name": "Phoenix Suns",
                "logoUrl": "/assets/logos/Phoenix Suns.svg",
                "code": "PHX"
            },
            {
                "id": 30,
                "name": "Sacramento Kings",
                "logoUrl": "/assets/logos/Sacramento Kings.svg",
                "code": "SAC"
            }
        ],
        "Southwest": [
            {
                "id": 8,
                "name": "Dallas Mavericks",
                "logoUrl": "/assets/logos/Dallas Mavericks.svg",
                "code": "DAL"
            },
            {
                "id": 14,
                "name": "Houston Rockets",
                "logoUrl": "/assets/logos/Houston Rockets.svg",
                "code": "HOU"
            },
            {
                "id": 19,
                "name": "Memphis Grizzlies",
                "logoUrl": "/assets/logos/Memphis Grizzlies.svg",
                "code": "MEM"
            },
            {
                "id": 23,
                "name": "New Orleans Pelicans",
                "logoUrl": "/assets/logos/New Orleans Pelicans.svg",
                "code": "NOP"
            },
            {
                "id": 31,
                "name": "San Antonio Spurs",
                "logoUrl": "/assets/logos/San Antonio Spurs.svg",
                "code": "SAS"
            }
        ]
    }
};
// export const getTeamLogoUrl = (teamId) => {
//     const team = teamsData.find((team) => team.id === teamId);
//     return team ? team.logo : "/assets/default-logo.png"; // Fallback for missing logos
//   };