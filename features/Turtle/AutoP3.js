import { autoP3Data as data } from "../../utils/data"
import Settings from "../../config"
import { stop, walk, jump, noWalk, renderBoxes, renderRings, edge } from "../../utils/AutoP3Utils"
import { lavaclip, leftClick, rightClick } from "../../utils/utils"
import { swapToItem, calcYawPitch, chat, rotate, slingshot, leap } from "../../utils/utils"
import ServerRotations from "../../utils/ServerRotations"

let inp3 = false;
let cooldown = false;
let selectedRoute = parseInt(Settings().route)
let rings = [];

rings = data.rings

register("chat", (message) => {
    let triggerMessage
    if (Settings().startOn) triggerMessage = Settings().startOnText
    else triggerMessage = "[BOSS] Storm: I should have known that I stood no chance."
    if (message !== triggerMessage) return
    inp3 = true;
    if (!Settings().autop3) return
    renderRing.register()
    renderMove.register()
}).setCriteria("${message}")

register("Command", () => {
    ChatLib.chat(Client.getMinecraft().func_175598_ae().field_78732_j)
}).setName("render")

register("Chat", () => {
    if (Settings().routeP1On) {
        selectedRoute = parseInt(Settings().routeP1)
        ChatLib.command("startp3", true)
    }
}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!")

register("Chat", () => {
    if (Settings().routeP3On) {
        selectedRoute = parseInt(Settings().routeP3)
    }
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance.")

register("Chat", () => {
    inp3 = false;
    renderMove.unregister()
    renderRing.unregister()
}).setCriteria("[BOSS] Goldor: You have done it, you destroyed the factory…")

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
        let distance = Math.sqrt(
            (Player.getX() - ring.x) ** 2 +
            (Player.getY() - ring.y) ** 2 +
            (Player.getZ() - ring.z) ** 2
        );

        return distance >= range;
    })
}).setName("removering")

register("Step", () => {
    if (Settings().autoSave) {
        data.save()
    }
    if (Settings().routeP1On || Settings().routeP3On) return
    selectedRoute = parseInt(Settings().route)
}).setFps(1)

register("command", (...args) => {

    let mc = Client.getMinecraft().func_175598_ae()
    let type = args[0].toLowerCase();
    let active = true
    let route = parseInt(selectedRoute)
    let [x, y, z] = [Math.round(mc.field_78730_l * 2) / 2, Math.round(mc.field_78731_m * 2) / 2, Math.round(mc.field_78728_n * 2) / 2]
    let [yaw, pitch] = [mc.field_78735_i, mc.field_78732_j]

    if (!["walk", "walk2", "jump", "jump2", "stop", "boom", "hclip", "hclip2", "bonzo", "look", "aura", "block", "block2", "bonzo2", "vclip", "edge", "leap"].includes(type)) {
        chat("Invalid ring type! Use: walk, jump, stop, boom, hclip, bonzo, look, aura, block, vclip, leap!")
        return;
    }

    if (["vclip", "block", "block2", "leap"].includes(type)) {
        if (type === "vclip") {
            if (args.length != 4 && args.length != 2) {
                chat("Invalid Parameters! Use /ring vclip h w depth")
                return
            }
            h = parseFloat(args[1]);
            w = parseFloat(args[2]);
            depth = parseInt(args[3])
            if (!h || !w) {
                depth = parseInt(args[1])
                h = 1
                w = 1
            }
            rings.push({ type, x, y, z, w, h, depth, active, route })
        } else if (type === "leap") {
            if (args.length != 4 && args.length != 2) {
                chat("Invalid Parameters! Use /ring leap h w class/IGN")
                return
            }
            h = parseFloat(args[1]);
            w = parseFloat(args[2]);
            target = parseInt(args[3])
            if (!h || !w) {
                target = parseInt(args[1])
                h = 1
                w = 1
            }
            rings.push({ type, x, y, z, w, h, target, active, route })
        } else {
            if (args.length != 4 && args.length != 6) {
                chat("Invalid Parameters! Use /ring block/block2 h w x y z")
                return
            }
            h = parseFloat(args[1]);
            w = parseFloat(args[2]);
            lookX = parseFloat(args[3]);
            lookY = parseFloat(args[4]);
            lookZ = parseFloat(args[5]);
            if (!lookY || !lookZ) {
                h = 1
                w = 1
                lookX = parseFloat(args[1]);
                lookY = parseFloat(args[2]);
                lookZ = parseFloat(args[3]);
            }
            rings.push({ type, x, y, z, w, h, lookX, lookY, lookZ, active, route })
        }
    } else {
        h = parseFloat(args[1]);
        w = parseFloat(args[2]);
        if (!h || !w) {
            h = 1
            w = 1
        }
        rings.push({ type, x, y, z, w, h, yaw, pitch, active, route })
    }

    cooldown = true

    Client.scheduleTask(19, () => {
        cooldown = false
    })

    chat(`${type} placed!`)
}).setName("ring")

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
    let playerX = Player.getX();
    let playerY = Player.getY();
    let playerZ = Player.getZ();

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
            switch (rings.type) {
                case "walk":
                    chat("Walking")
                    rotate(rings.yaw, rings.pitch)
                    walk()
                    break

                case "walk2":
                    chat("Walking")
                    stop()
                    rotate(rings.yaw, rings.pitch)
                    walk()
                    break

                case "jump":
                    chat("Jumping")
                    stop()
                    rotate(rings.yaw, rings.pitch)
                    jump()
                    break

                case "jump2":
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
                    if (Settings().silentLook) {
                        ServerRotations.set(rings.yaw, rings.pitch)
                        Client.scheduleTask(() => {
                            leftClick()
                            ServerRotations.resetRotations()
                        })
                    } else {
                        Client.scheduleTask(() => {
                            leftClick()
                        })
                    }
                    break

                case "hclip":
                    chat("Hclipping")
                    slingshot(rings.yaw)
                    break

                case "hclip2":
                    chat("Hclipping")
                    slingshot(rings.yaw)
                    Client.scheduleTask(() => { walk() })
                    break

                case "vclip":
                    chat("Vclipping")
                    lavaclip(rings.depth)
                    break

                case "bonzo":
                    chat("Bonzoing")
                    swapToItem("Bonzo's Staff")
                    stop()
                    if (Settings().silentLook) {
                        ServerRotations.set(rings.yaw, rings.pitch)
                        Client.scheduleTask(1, () => {
                            rightClick()
                            ServerRotations.resetRotations()
                        })
                    } else {
                        rotate(rings.yaw, rings.pitch)
                        Client.scheduleTask(() => {
                            rightClick()
                        })
                    }
                    break

                case "bonzo2":
                    chat("Bonzoing")
                    swapToItem("Bonzo's Staff")
                    if (Settings().silentLook) {
                        ServerRotations.set(rings.yaw, rings.pitch)
                        Client.scheduleTask(1, () => {
                            rightClick()
                            ServerRotations.resetRotations()
                        })
                    } else {
                        rotate(rings.yaw, rings.pitch)
                        Client.scheduleTask(() => {
                            rightClick()
                        })
                    }
                    break

                case "look":
                    chat("Looking")
                    rotate(rings.yaw, rings.pitch)
                    break

                case "aura":
                    chat("Auraing")
                    ChatLib.command("sg toggle", true)
                    break

                case "block":
                    chat("Blocking")
                    Player.getPlayer().func_70016_h(0, Player.getPlayer().field_70181_x, 0);
                    if (!rings.lookZ || !rings.lookY || !rings.lookX) return;
                    [yaw, pitch] = calcYawPitch(rings.lookX, rings.lookY, rings.lookZ)
                    rotate(yaw, pitch)
                    break

                case "block2":
                    chat("Blocking")
                    if (!rings.lookZ || !rings.lookY || !rings.lookX) return;
                    [yaw, pitch] = calcYawPitch(rings.lookX, rings.lookY, rings.lookZ)
                    rotate(yaw, pitch)
                    walk()
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
                    leap(rings.target)
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