import { autoP3Data as data } from "../../utils/data"
import Settings from "../../config"
import { stop, walk, jump, noWalk, renderBoxes, renderRings, edge } from "../../utils/AutoP3Utils"
import { float, int, lavaclip, leftClick, rightClick, setVelocity } from "../../utils/utils"
import { swapToItem, calcYawPitch, chat, rotate, slingshot, leap } from "../../utils/utils"
import ServerRotations from "../../utils/ServerRotations"

const mc = Client.getMinecraft().func_175598_ae()

let inp3 = false;
let cooldown = false;
let selectedRoute = parseInt(Settings().route)
let rings = [];

rings = data.rings

//chat registers
register("chat", (message) => {
    if (!Settings().autop3) return
    let triggerMessage
    if (Settings().startOn) triggerMessage = Settings().startOnText
    else triggerMessage = "[BOSS] Storm: I should have known that I stood no chance."
    if (message !== triggerMessage) return
    inp3 = true;
    renderRing.register()
    renderMove.register()
}).setCriteria("${message}")

register("Chat", () => {
    if (Settings().routeP3On) {
        selectedRoute = Settings().routeP3
    }
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance.")

register("Chat", () => {
    inp3 = false;
    renderMove.unregister()
    renderRing.unregister()
}).setCriteria("[BOSS] Goldor: You have done it, you destroyed the factory…")

register("Chat", () => {
    if (Settings().startOnBoss) {
        inp3 = true;
        if (!Settings().autop3) return
        renderRing.register()
        renderMove.register()
    }
    if (Settings().routeP1On) {
        selectedRoute = parseInt(Settings().routeP1)
        ChatLib.command("startp3", true)
    }
}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!")

//command registers

register("command", (route) => {
    Settings().getConfig().setConfigValue("Terminals", "route", route);
    selectedRoute = Settings().route
    chat(`Route ${route} loaded!`)
}).setName("load")

register("command", () => {
    data.rings = rings
    data.save()
    chat("Rings saved!")
}).setName("saverings")

register("command", () => {
    rings.pop();
    chat("Ring undone!")
}).setName("undo")

register("command", () => {
    rings = []
    data.save()
    chat("Rings cleared!")
}).setName("clearrings")

register("command", (range) => {
    rings = rings.filter(ring => {
        if (ring.route !== selectedRoute) return true;
        if (!range) { range = 2 }
        let mc = Client.getMinecraft().func_175598_ae()
        let distance = Math.sqrt(
            (mc.field_78730_l - ring.x) ** 2 +
            (mc.field_78731_m - ring.y) ** 2 +
            (mc.field_78728_n - ring.z) ** 2
        );
        return distance >= range;
    })
}).setName("removering")

register("command", () => {
    if (!Settings().editMode) { Settings().getConfig().setConfigValue("Terminals", "editMode", true); chat("Editmode on!") }
    else { Settings().getConfig().setConfigValue("Terminals", "editMode", false); chat("Editmode off!") }
}).setName("editmode")

register("Command", () => {
    inp3 = true;
    renderMove.register()
    renderRing.register()
    chat(`P3 Started!`)
}).setName("startp3")

register("Command", () => {
    inp3 = false;
    renderMove.unregister()
    renderRing.unregister()
    chat(`P3 Stopped!`)
}).setName("stopp3")

register("command", (...args) => {
    if (!args) { chat("/ring <type> [h] [w] [args]"); return }
    let [type, active, route, x, y, z, yaw, pitch] = [args[0].toLowerCase(), true, selectedRoute, Math.round(mc.field_78730_l * 2) / 2, Math.round(mc.field_78731_m * 2) / 2, Math.round(mc.field_78728_n * 2) / 2, mc.field_78735_i, mc.field_78732_j]
    if (!["look", "jump", "stop", "boom", "hclip", "bonzo", "block", "vclip", "edge", "leap"].includes(type)) { chat("Invalid ring type!"); return }
    let [looking, walking, stopping, clientSide, delaying, commanding, silent, cmd] = [false, false, false, false, false, false, false, ""]
    let [h, w] = [float(args[1]), float(args[2])]
    let [lookX, lookY, lookZ] = [float(args[3]), float(args[4]), float(args[5])]
    let action = args[3]
    let delay = 0
    args.slice(2).forEach((arg, index) => {
        if (arg === "stop") { stopping = true }
        if (arg === "look") { looking = true }
        if (arg === "walk") { walking = true }
        if (arg === "silent") { silent = true }
        if (arg === "client") { clientSide = true }
        if (arg.startsWith("delay:")) { delaying = true; delay = int(arg.slice(6)) }
        if (arg.startsWith("cmd:")) { commanding = true; cmd = args.slice(index + 2).join(' ').slice(4) }
    })
    if (isNaN(h)) h = 1;
    if (isNaN(w)) w = 1;
    let toPush = { type, active, route, x, y, z, w, h, yaw, pitch }
    if (delaying) { toPush.delaying = delaying; toPush.delay = delay }
    if (commanding) { toPush.commanding = commanding; toPush.cmd = cmd }
    if (silent) { toPush.silent = silent }
    if (walking) { toPush.walking = walking }
    if (stopping) { toPush.stopping = stopping }
    if (looking) { toPush.looking = looking }
    if (clientSide) { toPush.clientSide = clientSide }
    if (type === "block") { toPush.lookX = lookX; toPush.lookY = lookY; toPush.lookZ = lookZ; }
    if (["vclip", "leap"].includes(type)) { toPush.action = action }
    cooldown = true
    Client.scheduleTask(19, () => { cooldown = false })
    rings.push(toPush)
    chat(`${type} placed!`)
}).setName("ring")

const renderRing = register("renderWorld", () => {
    if (!Settings().autop3) return;
    if (!inp3) return;
    rings.forEach(rings => {
        if (rings.route !== selectedRoute) return;
        if (Settings().render) {
            renderRings(rings.x, rings.y, rings.z, rings.w, rings.type)
        } else {
            renderBoxes(rings.x, rings.y, rings.z, rings.h, rings.w, rings.type)
        }

    })
}).unregister()

const renderMove = register("renderWorld", () => {
    if (!Settings().autop3 || Settings().editMode) return;
    if (!inp3) return
    let [playerX, playerY, playerZ] = [mc.field_78730_l, mc.field_78731_m, mc.field_78728_n]
    if (Client.isInGui()) return
    rings.forEach(rings => {
        let distanceX = Math.abs(playerX - rings.x)
        let distanceY = (playerY - rings.y)
        let distanceZ = Math.abs(playerZ - rings.z)
        if (rings.route != selectedRoute) return;
        if (((distanceX > (rings.w / 2) || (distanceY > (rings.h) && distanceY >= -0.5) || distanceZ > (rings.w / 2)) && !rings.active)) {
            rings.active = true;
        }
        if (Settings().activeOnce && !rings.active) return
        if (distanceX < (rings.w / 2) && distanceY < (rings.h) && distanceY >= -0.5 && distanceZ < (rings.w / 2) && !cooldown) {
            rings.active = false
            if (rings.looking) { rotate(rings.yaw, rings.pitch) }
            if (rings.stopping) { Player.getPlayer().func_70016_h(0, Player.getPlayer().field_70181_x, 0) }
            if (rings.walking) { walk() }
            if (rings.commanding) { if (rings.clientSide) { ChatLib.command(rings.cmd, true) } else { ChatLib.command(rings.cmd, false) } }
            switch (rings.type) {
                case "jump":
                    chat("Jumping")
                    jump()
                    break
                case "stop":
                    chat("Stopping")
                    stop()
                    noWalk()
                    break
                case "boom":
                    chat("Exploding")
                    swapToItem("Infinityboom TNT")
                    if (rings.delaying) { Client.scheduleTask(int(rings.delay), () => { leftClick() }) }
                    else { Client.scheduleTask(0, () => { leftClick() }) }
                    break
                case "hclip":
                    chat("Hclipping")
                    //setVelocity(0, Player.getMotionY(), 0)
                    slingshot(rings.yaw)
                    if (rings.walking) {
                        if (Player.getPlayer().field_70122_E) {
                            Client.scheduleTask(4, () => {
                                walk()
                            })
                        } else {
                            Client.scheduleTask(1, () => {
                                walk()
                            })
                        }
                    }
                    break
                case "vclip":
                    chat("Vclipping")
                    lavaclip(rings.action)
                    break
                case "bonzo":
                    chat("Bonzoing")
                    swapToItem("Staff")
                    if (rings.silent) {
                        ServerRotations.set(rings.yaw, rings.pitch)
                        if (rings.delaying) { Client.scheduleTask(int(rings.delay), () => { rightClick(); ServerRotations.resetRotations() }) }
                        else { Client.scheduleTask(1, () => { rightClick(); ServerRotations.resetRotations() }) }
                    } else {
                        rotate(rings.yaw, rings.pitch)
                        if (rings.delaying) { Client.scheduleTask(int(rings.delay), () => { rightClick() }) }
                        else { Client.scheduleTask(1, () => { rightClick() }) }
                    }
                    break
                case "look":
                    chat("Looking")
                    rotate(rings.yaw, rings.pitch)
                    break
                case "block":
                    chat("Blocking")
                    if (!rings.lookZ || !rings.lookY || !rings.lookX) return;
                    rotate(...calcYawPitch(rings.lookX, rings.lookY, rings.lookZ))
                    break
                case "edge":
                    chat("Edging")
                    edge()
                    break
                case "leap":
                    if (inTerminal) {
                        rings.active = true
                        return
                    }
                    chat("Leaping")
                    leap(rings.action)
                    break
            }
        }
    })
}).unregister()

register("worldLoad", () => {
    inp3 = false;
    renderMove.unregister()
    renderRing.unregister()
});

register("Step", () => {
    if (Settings().autoSave) {
        data.rings = rings
        data.save()
    }
    selectedRoute = Settings().route
}).setFps(1)

//inTerminal check for leap ring

import packetOpenWindow from "../../utils/packetOpenWindow";
import closeWindow from "../../utils/closeWindow";

let inTerminal = false

packetOpenWindow.addListener(() => {
    inTerminal = true;
    //ChatLib.chat("inGui")
});

closeWindow.addListener(() => {
    inTerminal = false;
    //ChatLib.chat("notInGui")
});
