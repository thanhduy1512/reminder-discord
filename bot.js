import { Client, GatewayIntentBits } from 'discord.js';
import cron from 'node-cron';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
// Define your bot's token
const TOKEN = process.env.TOKEN;
// Define the channel ID where you want to send messages
const CHANNEL_ID = process.env.CHANNEL_ID;

// Initial days and hour
let daysToSend = [0, 2, 4]; // For example, Monday, Wednesday, Friday
let sendHour = 14; // For example, 14:00 (2:00 PM)

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Schedule the task to run every minute
  cron.schedule('* * * * *', () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();
    if (
      daysToSend.includes(currentDay) &&
      currentHour === sendHour &&
      now.getMinutes() === 0
    ) {
      const channel = client.channels.cache.get(CHANNEL_ID);
      if (channel) {
        channel.send('This is your scheduled message!');
      }
    }
  });
});

// Command to set the days
client.on('messageCreate', (message) => {
  console.log(message);
  if (message.content.startsWith('!setdays')) {
    console.log(message.content);
    const args = message.content.split(' ').slice(1);
    daysToSend = args.map(Number);
    message.channel.send(
      `Days to send messages have been updated to: ${daysToSend}`
    );
  }

  // Command to set the hour
  if (message.content.startsWith('!sethour')) {
    const args = message.content.split(' ').slice(1);
    const hour = parseInt(args[0], 10);
    if (0 <= hour && hour <= 23) {
      sendHour = hour;
      message.channel.send(
        `Hour to send messages has been updated to: ${sendHour}`
      );
    } else {
      message.channel.send(
        'Invalid hour. Please provide an hour between 0 and 23.'
      );
    }
  }

  // Command to show current settings
  if (message.content.startsWith('!showsettings')) {
    message.channel.send(
      `Current days: ${daysToSend}\nCurrent hour: ${sendHour}`
    );
  }
});

client.login(TOKEN);
