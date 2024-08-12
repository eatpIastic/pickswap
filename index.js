/// <reference types="../CTAutocomplete" />

import { registerWhen } from "../BloomCore/utils/Utils";
import { show, data } from "./config.js";

const C09PacketHeldItemChange = Java.type("net.minecraft.network.play.client.C09PacketHeldItemChange");

let avg = 0;
let row = 0;
let slot = 0;
let broken = 0;
let successfulSwaps = [];


register("packetSent", (packet, event) => {
  slot = packet.func_149614_c();
  broken = 0;
}).setFilteredClass(C09PacketHeldItemChange);


register("blockBreak", () => {
  if(broken>=1) return;
  broken++;

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
      if(data.ding) World.playSound(data.sound, 1, 1);
      let t = Date.now();
      successfulSwaps.push(t);
      onSwap(t);
    }
  }
});


registerWhen(register("renderOverlay", () => {
  if(avg==0) return;
  let str = `&7BPS: &f${(1000/avg).toFixed(1)}`;
  const w = Renderer.screen.getWidth();
  let x = w * data.rx;
  let sw = Renderer.getStringWidth(str);
  if(x+sw>w) {
    x = w-sw;
    data.rx = (x/w);
    data.save();
  }
  Renderer.drawStringWithShadow(str, Renderer.screen.getWidth() * data.rx, Renderer.screen.getHeight() * data.ry);
}), show);


function onSwap(t) {
  successfulSwaps = successfulSwaps.filter(n => (t-n)<=1000);

  if(successfulSwaps.length<2) {
    avg = 0;
    return;
  }

  avg = (successfulSwaps[successfulSwaps.length-1]-successfulSwaps[0]) / successfulSwaps.length;
  const beatsPB = data.pb[successfulSwaps.length]>=avg;

  if(!beatsPB && !data.spam) return;

  ChatLib.chat(`${beatsPB ? "&l&cPB! >>> " : ""}&f${successfulSwaps.length}: &a${avg} &f(&c${data.pb[successfulSwaps.length]}&f)`);
  if(beatsPB) {
    data.pb[successfulSwaps.length] = avg;
    data.save();
  }
  if(successfulSwaps.length >= 5 && avg <= 100) {
    ChatLib.chat(`&c>>  &f${successfulSwaps.length}: ${avg}`);
  }
}
