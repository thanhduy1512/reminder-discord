import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ChannelType,
} from 'discord.js';
import cron from 'node-cron';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

let reminders = [];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();
    const currentMinute = now.getMinutes();

    for (const reminder of reminders) {
      console.log(currentDay, currentHour, currentMinute);
      console.log(reminder);
      try {
        if (
          reminder.day === currentDay &&
          reminder.hour === currentHour &&
          reminder.minute === currentMinute
        ) {
          const channel = await client.channels.fetch(CHANNEL_ID);
          if (channel && channel.type === ChannelType.GuildText) {
            const embed = new EmbedBuilder()
              .setTitle('Thông báo có lịch học!')
              .setDescription(reminder.description)
              .setColor(0x00ae86)
              .setTimestamp(now);

            const fields = [];
            fields.push({
              name: 'Link Teams',
              value: `[Teams](https://teams.microsoft.com)`,
            });
            embed.addFields(fields);

            await channel.send({ embeds: [embed] });
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'addreminder') {
    const day = options.getInteger('day');
    const hour = options.getInteger('hour');
    const minute = options.getInteger('minute');
    const description = options.getString('description');
    reminders.push({ day, hour, minute, description });
    await interaction.reply(
      `Added reminder for day ${day} at hour ${hour}:${minute}`
    );
  }

  if (commandName === 'removereminder') {
    const day = options.getInteger('day');
    const hour = options.getInteger('hour');
    const minute = options.getInteger('minute');
    reminders = reminders.filter(
      (reminder) =>
        !(
          reminder.day === day &&
          reminder.hour === hour &&
          reminder.minute === minute
        )
    );
    await interaction.reply(
      `Removed reminder for day ${day} at hour ${hour}:${minute}`
    );
  }

  if (commandName === 'showreminders') {
    if (reminders.length > 0) {
      const reminderMessages = reminders
        .map(
          (reminder) =>
            `Day: ${reminder.day}, Hour: ${reminder.hour}, Minute: ${reminder.minute}`
        )
        .join('\n');
      await interaction.reply(`Current reminders:\n${reminderMessages}`);
    } else {
      await interaction.reply('No reminders set.');
    }
  }

  if (commandName === 'clearreminders') {
    reminders = [];
    await interaction.reply('All reminders have been cleared.');
  }
});

client.login(TOKEN);
