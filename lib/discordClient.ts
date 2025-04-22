// lib/discordClient.ts
import { Client, GatewayIntentBits } from 'discord.js'

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
})

let ready = false

bot.once('ready', () => {
  console.log('🤖 Bot 已準備好查詢暱稱')
  ready = true
})

if (!bot.isReady()) {
  bot.login(process.env.DISCORD_TOKEN)
}

export { bot, ready }
