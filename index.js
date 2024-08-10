/// <reference types="../CTAutocomplete" />

import PogObject from "../PogData";
import Dungeon from "../BloomCore/dungeons/Dungeon";

const data = new PogObject("pickswap", {
  "ding": true,
  "spam": false,
  "streak": false,
  "streakpb": 0,
  "familyGuy": true,
  "pb": [10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000]
}, "data.json");

register("command", (...args) => {
  switch(args[0].toLowerCase()) {
    case "reset":
      for(let i=0; i<data.pb.length; i++) {
        data.pb[i] = 10000;
      }
      data.streakpb = 0;
      data.save();
      ChatLib.chat("pickswap pb data reset");
      break;
    case "spam":
      data.spam = !data.spam;
      data.save();
      ChatLib.chat(`pickswap set to${data.spam ? " " : " not "}spam`);
      break;
    case "streak":
      data.streak = !data.streak;
      data.save();
      ChatLib.chat(`pickswap streak ${data.streak ? "enabled" : "disabled"}`);
      break;
    case "ding":
      data.ding = !data.ding;
      data.save();
      ChatLib.chat(`pickswap ding ${data.ding ? "enabled" : "disabled"}`);
      break;
    case "familyguy":
      data.familyGuy = !data.familyGuy;
      data.save();
      ChatLib.chat(`pickswap family guy ${data.familyGuy ? "enabled" : "disabled"}`);
      break;
    default:
      ChatLib.chat("pickswap cmds: reset, spam, streak, ding, familyGuy");
      break;
  }
}).setName("pickswap");

const C09PacketHeldItemChange = Java.type("net.minecraft.network.play.client.C09PacketHeldItemChange");
let slot = 0;
let sinceLastShit = 0;
register("packetSent", (packet, event) => {
  slot = packet.func_149614_c();
  sinceLastShit = 0;
}).setFilteredClass(C09PacketHeldItemChange);

let links = 
["https://www.youtube.com/watch?v=tvOkF8cEsdQ", 
  "https://www.youtube.com/watch?v=EL4UdaLTVWc",
  "https://www.youtube.com/watch?v=dVFm8veHbqc",
  "https://www.youtube.com/watch?v=AGxza2_oEcA",
  "https://www.youtube.com/watch?v=3e-arMnTwTQ"
]
let a = Java.type("java.awt.Desktop");
let b = Java.type("java.net.URI");

let successfulSwaps = [];

function bs() {
  let time = Date.now();
  successfulSwaps = successfulSwaps.filter(n => (time-n)<=1000);
  if(successfulSwaps.length<2) return;

  let avg = (successfulSwaps[successfulSwaps.length-1]-successfulSwaps[0]) / successfulSwaps.length;
  let beatsPB = data.pb[successfulSwaps.length]>=avg;

  if(!data.spam && !beatsPB) return;

  ChatLib.chat(`${beatsPB ? "&l&cPB! >>> " : ""}&f${successfulSwaps.length}: &a${avg} &f(&c${data.pb[successfulSwaps.length]}&f)`);
  
  if(beatsPB) {
    data.pb[successfulSwaps.length] = avg;
    data.save();
  }

  if(successfulSwaps.length >= 5 && avg <= 100) {
    if(!Dungeon.inDungeon && data.familyGuy) a.getDesktop().browse(new b(links[Math.floor(Math.random() * links.length)]));
    ChatLib.chat(`&cFamily Guy. >>  &f${successfulSwaps.length}: ${avg}`);
  }
}

let row = 0;
register("blockBreak", () => {
  if(sinceLastShit>=1) return;
  sinceLastShit++;
  let packetItem = Player.getInventory()?.getItems()[slot]?.getRegistryName();
  let holdingPickaxe = Player.getHeldItem()?.getRegistryName()?.includes("pickaxe");
  if(data.streak && packetItem?.includes("pickaxe") && holdingPickaxe) {
    ChatLib.chat(`&cStreak Broken: ${row}`);
    if(row>=data.streakpb) {
      ChatLib.chat(`new pickswap streak pb: ${row}`);
      data.streakpb = row;
      data.save();
    }
    row = 0;
  }
  if(!packetItem?.includes("pickaxe") && packetItem!="minecraft:bow") {
    if(holdingPickaxe) {
      row++;
      if(data.ding) World.playSound("random.orb", 1, 1);
      successfulSwaps.push(Date.now());
      bs();
    }
  }
});
