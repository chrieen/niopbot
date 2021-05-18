const Discord = require('discord.js');
var express = require('express');
const ytdl = require('ytdl-core');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const Jimp = require('jimp');
const ms = require('ms');
const fs = require('fs');
const canvas = require('canvas');
const momenttimezone = require('moment-timezone')
const db = require('quick.db');
const YouTube = require('simple-youtube-api');
const superagent = require("superagent");
const { promisify } = require('util')
const chalk = require('chalk');
const weather = require('weather-js')
const moment = require('moment');
require('./util/eventLoader')(client)
const DBL = require("dblapi.js");
const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwMTY3NjM5MzQzMjc0MzkzNiIsImJvdCI6dHJ1ZSwiaWF0IjoxNTQ1NDA5ODYzfQ.UBd4sYZIn0IqfXUV2gdDkyeBBooh_5dWnacHEhWzDOw', client);
dbl.on('posted', () => {
  console.log('[-] BOT: Server kısmını ayarladım !');
})

dbl.on('error', e => {
 console.log(`Oops! ${e}`);
})

const log = message => {
  console.log(`${message}`);
};

client.on('ready', () => {
  console.log(``);
});


  client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};





var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.on("guildMemberAdd", async member => {
  let prefix = await db.fetch(`prefix_${member.guild.id}`);
if (prefix == null) prefix = '!'
  let sayac = await db.fetch(`sayac_${member.guild.id}`);
  let skanal = await db.fetch(`sayacK_${member.guild.id}`);
  if (!skanal) return;
  const skanal2 = member.guild.channels.find('name', skanal)
  const sayacgmesaj = await db.fetch(`sayacgm_${member.guild.id}`)
  skanal2.send(sayacgmesaj ? sayacgmesaj.replace('{kullanıcı}', `${member.user}`) .replace('{toplam}', `${sayac}`) .replace('{kalan}', `${sayac - member.guild.members.size}`) : `:inbox_tray: \`${member.user.tag}\` adlı kullanıcı sunucuya katıldı. \`${sayac}\` kullanıcı olmaya \`${sayac - member.guild.members.size}\` kullanıcı kaldı. (\`${prefix}sayaç-giriş-mesaj\` komutu ile değiştirilebilir.)`)

if (member.guild.members.size == sayac) {
    skanal2.send(`:tada: Sunucu \`${sayac}\` kullanıcıya ulaştı. Sayaç sıfırlandı.`)
    .then(db.delete(`sayac_${member.guild.id}`))
    .then(db.delete(`sayacK_${member.guild.id}`))
  }
});

client.on("guildMemberRemove", async member => {
  let prefix = await db.fetch(`prefix_${member.guild.id}`);
if (prefix == null) prefix = '!'
  let sayac = await db.fetch(`sayac_${member.guild.id}`);
  let skanal = await db.fetch(`sayacK_${member.guild.id}`);
  if (!skanal) return;
  const skanal2 = member.guild.channels.find('name', skanal)
  const sayaccmesaj = await db.fetch(`sayaccm_${member.guild.id}`)
 skanal2.send(sayaccmesaj ? sayaccmesaj.replace('{kullanıcı}', `${member.user.tag}`) .replace('{sayı}', `${sayac}`) .replace('{kalan}', `${sayac - member.guild.members.size}`) : `:inbox_tray: \`${member.user.tag}\` adlı kullanıcı sunucudan ayrıldı. \`${sayac}\` kullanıcı olmaya \`${sayac - member.guild.members.size}\` kullanıcı kaldı. (\`${prefix}sayaç-çıkış-mesaj\` komutu ile değiştirilebilir.)`)
});


client.on('guildMemberAdd', async member => {
  
  let rol = await db.fetch(`otorol_${member.guild.id}`);
  let rol2 = member.guild.roles.find('name', rol);
  
  const rolk = await db.fetch(`rolK_${member.guild.id}`);
  if(!rolk) return;
  const rolk2 = member.guild.channels.find('name', rolk)
  const otorolmesaj = await db.fetch(`otorolm_${member.guild.id}`)
  
  member.addRole(rol2);
  rolk2.send(otorolmesaj ? otorolmesaj.replace('{kullanıcı}', `${member.user}`) .replace('{rol}',`${rol2.name}`) : `\`${member.user.tag}\` adlı kullanıcıya \`${rol2.name}\` rolü verildi.`)
});

client.on("guildMemberAdd", async member => {
  let prefix = await db.fetch(`prefix_${member.guild.id}`);
if (prefix == null) prefix = '!'
  let mkanal = await db.fetch(`mgcK_${member.guild.id}`);
  if (!mkanal) return;
  const mkanal2 = member.guild.channels.find('name', mkanal)
  const gmesaj = await db.fetch(`girism_${member.guild.id}`)
  mkanal2.send(gmesaj ? gmesaj.replace('{kullanıcı}', `${member.user}`) .replace('{sunucu}', `${member.guild.name}`) : `\`${member.user.tag}\` Adlı Kullanıcı \`${member.guild.name}\` Adlı Sunucuya Katıldı. (\`${prefix}giriş-mesaj\` komutu ile değiştirilebilir.)`)
});

client.on("guildMemberRemove", async member => {
  let prefix = await db.fetch(`prefix_${member.guild.id}`);
if (prefix == null) prefix = '!'
  let mkanal = await db.fetch(`mgcK_${member.guild.id}`);
  if (!mkanal) return;
  const mkanal2 = member.guild.channels.find('name', mkanal)
  const cmesaj = await db.fetch(`cikism_${member.guild.id}`)
 mkanal2.send(cmesaj ? cmesaj.replace('{kullanıcı}', `${member.user.tag}`) .replace('{sunucu}', `${member.guild.name}`) : `\`${member.user.tag}\` Adlı Kullanıcı \`${member.guild.name}\`Adlı Sunucudan Ayrıldı. (\`${prefix}çıkış-mesaj\` komutu ile değiştirilebilir.)`)
});

client.config = require("./config.js")
client.logger = console
client.wait = promisify(setTimeout)
client.ayar = db

String.prototype.toProperCase = function() {
  return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Uncaught Exception: ", errorMsg);
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: ", err);
});

client.login(process.env.token)


///komutlar
client.on("guildMemberAdd", member => {
  const profil = JSON.parse(fs.readFileSync("./sayaç.json", "utf8"));
  if (!profil[member.guild.id]) return;
  if (profil[member.guild.id]) {
    let sayaçkanalID = profil[member.guild.id].kanal;
    let sayaçsayı = profil[member.guild.id].sayi;
    let sayaçkanal = client.channels.get(sayaçkanalID);
    let aralık = parseInt(sayaçsayı) - parseInt(member.guild.members.size);
    sayaçkanal.sendMessage(
      "🔹 `" +
        `${member.user.tag}` +
        "` Sunucuya Katıldı \n🔹 `" +
        sayaçsayı +
        "` Kişi Olmamıza `" +
        aralık +
        "` Kişi Kaldı! \n🔹 `" +
        member.guild.members.size +
        "` Kişiyiz!"
    );
  } 
});

client.on("guildMemberRemove", member => {
  const profil = JSON.parse(fs.readFileSync("./sayaç.json", "utf8"));
  if (!profil[member.guild.id]) return;
  if (profil[member.guild.id]) {
    let sayaçkanalID = profil[member.guild.id].kanal;
    let sayaçsayı = profil[member.guild.id].sayi;
    let sayaçkanal = client.channels.get(sayaçkanalID);
    let aralık = parseInt(sayaçsayı) - parseInt(member.guild.members.size);
    sayaçkanal.sendMessage(
      "🔸 `" +
        `${member.user.tag}` +
        "` Sunucudan Ayrıldı! \n🔸 `" +
        sayaçsayı +
        "` Kişi Olmamıza `" +
        aralık +
        "` Kişi Kaldı! \n🔸 `" +
        member.guild.members.size +
        "` Kişiyiz!"
    );
  }
});