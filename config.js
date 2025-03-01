import PogObject from "../PogData";

export const data = new PogObject("pickswap", {
    "ding": true,
    "spam": false,
    "streak": false,
    "streakpb": 0,
    "sound": "random.orb",
    "show": true,
    "pb": [10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000],
    "decimals": 1,
    "x": 100,
    "y": 100
}, "data.json");

export const show = () => {return data.show};
const tabCompletions = ["setsound", "reset", "spam", "streak", "ding", "show", "move", "decimals"];

const gui = new Gui();

register("command", (...args) => {
    if (!args?.[0]) {
        ChatLib.chat(`pickswap cmds: ${tabCompletions.join(", ")}`);
        return;
    }

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
        case "decimals":
            let tempDecimals = parseInt(args?.[1]);
            if (!tempDecimals) {
                ChatLib.chat("ex: /pickswap decimals 2");
                return;
            }
            data.decimals = tempDecimals;
            data.save();
            break;
    }
}).setName("pickswap").setTabCompletions(tabCompletions);


register("dragged", (dx, dy, mx, my, b) => {
    if(!gui.isOpen()) {
        return;
    }

    data.x = mx;
    data.y = my;
    data.save();
});
