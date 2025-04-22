export default function handler(req, res) {
    const redirect_uri = process.env.DISCORD_REDIRECT_URI;
    const client_id = process.env.DISCORD_CLIENT_ID;
    const scope = 'identify';
  
    const url = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${scope}`;
  
    res.redirect(url);
  }
  