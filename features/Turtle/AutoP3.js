import { autoP3Data as data } from "../../utils/data"
import Settings from "../../config"
import { stop, walk, rotate, jump, noWalk, edgeJump, renderBoxes, renderRings } from "../../utils/autoP3Utils"
import { leftClick, rightClick } from "../../utils/utils"
import { swapToItem, block, chat } from "../../utils/utils"
import ServerRotations from "../../utils/ServerRotations"

let inp3 = false;
let cooldown = false;
let selectedRoute = parseInt(Settings().route)
let rings = [];
let toggled = false;

rings = data.rings

const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");

const keybinds = [
    Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74370_x.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74366_z.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74368_y.func_151463_i()
];

register("Chat", () => {
    inp3 = true;
    if (!Settings().autop3) return
    if (!Settings().render) {
        renderBox.register()
    }
    else {
        renderRing.register()
    }
    renderMove.register()
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance.")

register("Chat", () => {
    inp3 = false;
    vclip.unregister()
    renderMove.unregister()
    renderBox.unregister()
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

register("Command", () => {
    selectedRoute = parseInt(Settings().route)
}).setName("load")

register("command", (...args) => {
    if (!args) {
        chat("Usage: /ring §8<§7type§8> [§7height§8] [§7width§8] [§7x§8] [§7y§8] [§7z§8] [§7time§8]")
        return;
    }

    let type = args[0].toLowerCase();
    let x = Math.round(Player.getX() * 2) / 2;
    let y = Math.round(Player.getY() * 2) / 2;
    let z = Math.round(Player.getZ() * 2) / 2;
    let yaw = Player.getYaw();
    let pitch = Player.getPitch();
    let active = true
    let route = parseInt(selectedRoute)

    chat(route)

    if (!["walk", "walk2", "jump", "jump2", "stop", "boom", "hclip", "hclip2", "bonzo", "look", "aura", "block", "block2", "bonzo2", "vclip", "edge"].includes(type)) {
        chat("Invalid ring type! Use: walk, jump, stop, boom, hclip, bonzo, look, aura, block, vclip!")
        return;
    }

    if (["vclip", "block", "block2"].includes(type)) {
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

register("Command", (y) => {
    toggled = true;
    currDepth = parseInt(y)
    vclip.register()
    vclipOverlay.register()
}).setName("clip")

register("Command", () => {
    edgeJump.register()
}).setName("edgejump")

register("Command", () => {
    inp3 = true;
    renderMove.register()
    if (!Settings().render) {
        renderBox.register()
    }
    else {
        renderRing.register()
    }
    chat(`P3 Started!`)
}).setName("startp3")

register("Command", () => {
    inp3 = false;
    vclip.unregister()
    renderMove.unregister()
    renderBox.unregister()
    renderRing.unregister()
}).setName("stopp3")

register("Command", (yaw, pitch) => {
    if (Math.abs(yaw) > 180 || Math.abs(pitch) > 90) {
        chat(`Pitch and/or Yaw out of bounds.`)
        return
    }
    chat(`Rotating.`)
    Player.getPlayer().field_70177_z = yaw;
    Player.getPlayer().field_70125_A = pitch;
}).setName("rotating")

const renderBox = register("renderWorld", () => {
    if (!Settings().autop3) return;
    if (!inp3) return;
    rings.forEach(rings => {
        if (rings.route !== selectedRoute) return;
        renderBoxes(rings.x, rings.y, rings.z, rings.h, rings.w, rings.type)
    })
}).unregister()

const renderRing = register("renderWorld", () => {
    if (!Settings().autop3) return;
    if (!inp3) return;
    rings.forEach(rings => {
        if (rings.route !== selectedRoute) return;
        renderRings(rings.x, rings.y, rings.z, rings.w, rings.type)
    })
}).unregister()

const renderMove = register("renderWorld", () => {
    if (!Settings().autop3) return;
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
        if (!rings.active) return
        if (distanceX < (rings.w / 2) && distanceY < (rings.h) && distanceY >= -0.5 && distanceZ < (rings.w / 2) && !cooldown) {
            rings.active = false
            let speed
            let yaw
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
                    speed = (Player.getPlayer().field_71075_bZ.func_75094_b() * 2.8);
                    yaw = (rings.yaw) * Math.PI / 180;

                    keybinds.forEach(keybind => KeyBinding.func_74510_a(keybind, false)) // Release all keybinds
                    Player.getPlayer().func_70016_h(0, Player.getPlayer().field_70181_x, 0);

                    Client.scheduleTask(0, () => {
                        Player.getPlayer().func_70016_h(-Math.sin(yaw) * speed, Player.getPlayer().field_70181_x, Math.cos(yaw) * speed);
                    })
                    break

                case "hclip2":
                    chat("Hclipping")
                    speed = (Player.getPlayer().field_71075_bZ.func_75094_b() * 2.8);
                    yaw = (rings.yaw) * Math.PI / 180;

                    keybinds.forEach(keybind => KeyBinding.func_74510_a(keybind, false)) // Release all keybinds
                    Player.getPlayer().func_70016_h(0, Player.getPlayer().field_70181_x, 0);

                    Client.scheduleTask(0, () => {
                        Player.getPlayer().func_70016_h(-Math.sin(yaw) * speed, Player.getPlayer().field_70181_x, Math.cos(yaw) * speed);
                        walk()
                    })
                    break

                case "vclip":
                    chat("Vclipping")
                    ChatLib.command("clip " + parseInt(rings.depth), true)
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
                    block(rings.lookX, rings.lookY, rings.lookZ)
                    break

                case "block2":
                    chat("Blocking")
                    if (!rings.lookZ || !rings.lookY || !rings.lookX) return;
                    block(rings.lookX, rings.lookY, rings.lookZ)
                    walk()
                    break

                case "edge":
                    chat("Edging")
                    ChatLib.command("edgejump", true)
                    break

            }
        }
    })
}).unregister()

register("worldLoad", () => {
    inp3 = false;
    renderMove.unregister()
    renderBox.unregister()
    renderRing.unregister()
});

let currDepth = 20

register("Command", (y) => {
    if (isNaN(y)) {
        chat("please use a number")
        return
    }
    if (y > 40.1 && y < 3) {
        currDepth = y
        vclip.register()

    } else {
        chat("Distance has to be between 40 and 3")
    }
}).setName("clip")

register("Command", () => {
    vclip.unregister()
}).setName("noclip")

const vclipOverlay = register("renderOverlay", () => {
    let text = "Dirty Cheater!"
    let scale = 1.5
    Renderer.scale(scale)
    Renderer.drawStringWithShadow(text, (Renderer.screen.getWidth() / scale - Renderer.getStringWidth(text)) / 2, Renderer.screen.getHeight() / scale / 2 + 16)
}).unregister()

const vclip = register("tick", () => {
    if (!Player.getPlayer().func_180799_ab()) return
    Player.getPlayer().func_70107_b(Player.getX(), Player.getY() - currDepth, Player.getZ())
    const veloPacket = register("packetReceived", (packet, event) => {
        if (Player.getPlayer().func_145782_y() !== packet.func_149412_c()) return;
        if (packet.func_149410_e() !== 28000) return;
        cancel(event)
        veloPacket.unregister();
        vclip.unregister();
        vclipOverlay.unregister()
        toggled = false
    }).setFilteredClass(S12PacketEntityVelocity);
}).unregister();