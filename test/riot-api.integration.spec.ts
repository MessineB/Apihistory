const RIOT_API_KEY = process.env.RIOT_API_KEY;
const BASE_URL = 'https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id';

describe('Riot API', () => {
  it('retourne les infos d’un joueur valide', async () => {
    const gameName = 'Faker'; // 🔁 change si nécessaire
    const tagLine = 'KR1';

    const url = `${BASE_URL}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

    const response = await fetch(url, {
      headers: {
        'X-Riot-Token': RIOT_API_KEY!,
      },
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('puuid');
    expect(data.gameName).toBe(gameName);
  });
});
