import PogObject from "../PogData";

export const data = new PogObject("pickswap", {
    "ding": true,
    "spam": false,
    "streak": false,
    "streakpb": 0,
    "sound": "random.orb",
    "show": true,
    "rx": 4,
    "ry": 4,
    "pb": [10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000]
}, "data.json");

export const show = () => {return data.show};

const gui = new Gui();

register("command", (...args) => {
  if(!args) args = [""]
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
    case "show":
      data.show = !data.show;
      data.save();
      ChatLib.chat(`pickswap gui set to${data.show ? "" : " not"} show`);
      break;
    case "move":
      gui.open();
      break;
    case "ding":
      data.ding = !data.ding;
      data.save();
      ChatLib.chat(`pickswap ding ${data.ding ? "enabled" : "disabled"}`);
      break;
    case "getr":
      ChatLib.chat("formatted as x, y. copy the chat msg and just paste the whole thing into another module with setr comma and all. or without the comma. it doesnt matter.");
      ChatLib.chat(`${data.rx} ${data.ry}`);
      break;
    case "setr":
      data.rx = args[1].replace(",", "").replace(" ", "");
      data.ry = args[2].replace(" ", "");
      data.save();
      break;
    case "setsound":
      data.sound = args[1];
      try {
        World.playSound(args[1], 1, 1);
      } catch(e) {
        ChatLib.chat("pickswap sound error. reset to random.orb");
        data.sound = "random.orb";
      }
      data.save();
      break;
    default:
      ChatLib.chat("pickswap cmds: reset, spam, streak, ding, show, move, getr, setr");
      break;
  }
}).setName("pickswap");

register("dragged", (dx, dy, x, y, b) => {
    if(!gui.isOpen()) return;
    data.rx = (x/Renderer.screen.getWidth());
    data.ry = (y/Renderer.screen.getHeight());
    data.save();
});
