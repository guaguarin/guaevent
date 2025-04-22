// pages/api/nickname.ts
import { bot, ready } from '@/lib/discordClient'

export default async function handler(req, res) {
  if (!ready) return res.status(503).json({ error: 'Bot 尚未準備完成' })

  const { id } = req.query
  const guildId = process.env.DISCORD_GUILD_ID

  if (!id || !guildId) return res.status(400).json({ error: '缺少 id 或 guildId' })

  try {
    const guild = await bot.guilds.fetch(guildId)
    const member = await guild.members.fetch(id.toString())

    const nickname = member.nickname || member.user.username
    return res.status(200).json({ nickname })
  } catch (err) {
    console.error('❌ 查詢暱稱錯誤：', err)
    return res.status(500).json({ error: '無法查詢暱稱' })
  }
}
