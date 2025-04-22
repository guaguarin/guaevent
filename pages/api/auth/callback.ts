import axios from 'axios';

export default async function handler(req, res) {
  const code = req.query.code;

  const data = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
  });

  try {
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token', data.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenRes.data.access_token}`,
      },
    });

    const user = userRes.data;

    res.send(`
      <h1>登入成功 🎉</h1>
      <p>你好，${user.username}#${user.discriminator}</p>
      <pre>${JSON.stringify(user, null, 2)}</pre>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('登入失敗');
  }
}
