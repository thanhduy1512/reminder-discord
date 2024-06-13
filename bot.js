import { Client, GatewayIntentBits } from 'discord.js';
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

  cron.schedule('* * * * *', () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();
    const currentMinute = now.getMinutes();

    reminders.forEach((reminder) => {
      if (
        reminder.day === currentDay &&
        reminder.hour === currentHour &&
        reminder.minute === currentMinute
      ) {
        const channel = client.channels.cache.get(CHANNEL_ID);
        if (channel) {
          channel.send('This is your scheduled message!');
        }
      }
    });
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'addreminder') {
    const day = options.getInteger('day');
    const hour = options.getInteger('hour');
    const minute = options.getInteger('minute');
    reminders.push({ day, hour, minute });
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
