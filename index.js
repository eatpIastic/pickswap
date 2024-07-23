/// <reference types="../CTAutocomplete" />

import PogObject from "../PogData";

const data = new PogObject("pickswap", {
  "ding": true,
  "pb": [10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000]
}, "data.json");

register("command", () => {
  data.ding = !data.ding;
  data.save();
  ChatLib.chat(`pickswap ding ${data.ding ? "enabled" : "disabled"}`);
}).setName("pickswap");

const C09PacketHeldItemChange = Java.type("net.minecraft.network.play.client.C09PacketHeldItemChange");
let slot = 0;
register("packetSent", (packet, event) => {
  slot = packet.func_149614_c();
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
  let d = Date.now();
  successfulSwaps = successfulSwaps.filter(n => d-n<=1000);
  if(successfulSwaps.length<2) return;

  let avg = Math.floor(averageTimeBetweenFirstAndLast(successfulSwaps));
  if(data.pb[successfulSwaps.length]>=avg) {
    ChatLib.chat(`&f${successfulSwaps.length}: &a${avg} &f(&c${data.pb[successfulSwaps.length]}&f)`);
    data.pb[successfulSwaps.length] = avg;
    data.save();
  }
  if(successfulSwaps.length >= 5 && avg <= 100) {
    a.getDesktop().browse(new b(links[Math.floor(Math.random() * links.length)]));
  }

}

register("blockBreak", (block) => {
  if(!Player.getInventory()?.getItems()[slot]?.getRegistryName()?.includes("pickaxe")) {
    if(Player.getHeldItem()?.getRegistryName().includes("pickaxe")) {
      if(data.ding) World.playSound("random.orb", 1, 1);
      successfulSwaps.push(Date.now());
      bs();
    }
  }
});

function averageTimeBetweenFirstAndLast(timestamps) {
  const firstTimeSeconds = timestamps[0] / 1000;
  const lastTimeSeconds = timestamps[timestamps.length - 1] / 1000;
  const totalTimeSeconds = lastTimeSeconds - firstTimeSeconds;
  const averageTimeSeconds = totalTimeSeconds / (timestamps.length - 1);

  return averageTimeSeconds * 1000;
}

