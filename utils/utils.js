export const soundNames = ["note.pling", "mob.blaze.hit", "fire.ignite", "random.orb", "mob.cat.meow"]
export const classes = ["Archer", "Berserk", "Mage", "Healer", "Tank"]

// Plays a sound!!!
export function playSound(soundName, volume, pitch) {
    try {
        new net.minecraft.network.play.server.S29PacketSoundEffect(soundName, Player.getX(), Player.getY(), Player.getZ(), volume, pitch).func_148833_a(Client.getConnection()) // Idk why I couldn't get World.playSound() to work but whatever
    } catch (e) { }
}

export function leftClick() {
    const leftClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147116_af", null)
    leftClickMethod.setAccessible(true);
    leftClickMethod.invoke(Client.getMinecraft(), null);
}

export function rightClick() {
    const rightClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147121_ag", null)
    rightClickMethod.setAccessible(true);
    rightClickMethod.invoke(Client.getMinecraft(), null);
}

export const swapToItem = (targetItemName) => {
    const itemSlot = Player?.getInventory()?.getItems()?.findIndex(item => { return item?.getName()?.toLowerCase()?.includes(targetItemName.toLowerCase()) })
    if (itemSlot === -1 || itemSlot > 7) {
        chat(`Unable to find "${targetItemName}" in your hotbar`)
        return
    } else {
        heldItem = Player.getHeldItemIndex() // Does this do anything????????????????????
        Player.setHeldItemIndex(itemSlot)
    }
}

export function calcYawPitch(x, y, z) {
    distanceLookX = x - Player.getX()
    distanceLookY = y - Player.getY()
    distanceLookZ = z - Player.getZ()

    yawRad = Math.atan2(distanceLookX, distanceLookZ)
    yaw = yawRad * (180 / Math.PI)
    yaw = -yaw
    if (yaw < 0) {
        yaw += 360;
    }

    horitzontalDistance = Math.sqrt(distanceLookX * distanceLookX + distanceLookZ * distanceLookZ)

    pitchRad = Math.atan2(-distanceLookY, horitzontalDistance)
    pitch = pitchRad * (180 / Math.PI)

    return [yaw, pitch]
}

export function rotate(yaw, pitch) {
    const player = Player.getPlayer();

    player.field_70177_z = yaw;
    player.field_70125_A = pitch;
}

const defaultColor = "§7"
export function chat(message) {
    ChatLib.chat("§0[§6Yharim§0] " + defaultColor + message.toString().replaceAll("§r", defaultColor))
}

export function format(message) {
    return "§0[§6Yharim§0] " + defaultColor + message.toString().replaceAll("§r", defaultColor)
}

export function float(value) {
    return parseFloat(value)
}

export function int(value) {
    return parseInt(value)
}

const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");
const S12PacketEntityVelocity = Java.type("net.minecraft.network.play.server.S12PacketEntityVelocity")

const movementKeys = [
    Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74370_x.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74366_z.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74368_y.func_151463_i()
]
export const releaseMovementKeys = () => movementKeys.forEach(keybind => KeyBinding.func_74510_a(keybind, false))
export const repressMovementKeys = () => movementKeys.forEach(keybind => KeyBinding.func_74510_a(keybind, Keyboard.isKeyDown(keybind)))

import Dungeons from "../../Atomx/skyblock/Dungeons"
import { jump } from "./AutoP3Utils";
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
let awaitingLeap = false

export function leap(player) {
    swapToItem("leap")
    Client.scheduleTask(0, () => rightClick())
    awaitingLeap = true

    register("packetReceived", () => {
        if (!awaitingLeap) return
        awaitingLeap = false
        Client.scheduleTask(0, () => {
            if (Player.getContainer().getName() !== "Spirit Leap") return
            const teamMembers = Dungeons.getTeamMembers()
            let playerName
            if (classes.includes(player)) { // (Hopefully) detect if you are trying to leap to a class  
                playerName = Object.getOwnPropertyNames(teamMembers).find(playerName => teamMembers[playerName].class === player)
                if (!playerName) { chat("Class not found!"); return }
            } else playerName = player

            const item = Player.getContainer()?.getItems().findIndex(x => x?.getName()?.substring(2)?.toLowerCase() === playerName.toLowerCase())

            if (item === -1) {
                chat("Could not find " + player)
                return
            }
            // ChatLib.chat(`item: ${item}`)
            Player.getContainer().click(item)
        })
    }).setFilteredClass(S2DPacketOpenWindow)

}

export const clipForward = (distance) => { // I have no idea how optimal this is because I literally haven't learned about this shit in school yet and have very little understanding of it but it works
    const radians = Player.getYaw() * Math.PI / 180
    let [newX, newZ] = [Player.getX(), Player.getZ()]

    if (Math.abs(-Math.sin(radians)) > Math.abs(Math.cos(radians))) newX += distance * Math.sign(-Math.sin(radians))
    else newZ += distance * Math.sign(Math.cos(radians))
    //Player.asPlayerMP().setPosition(newX, Player.getY(), newZ)
    Player.getPlayer().func_70107_b(newX, Player.getY(), newZ)
}

const keybinds = [
    Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74370_x.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74366_z.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74368_y.func_151463_i()
];

export function slingshot(direction) {
    speed = ((Player.getPlayer().field_71075_bZ.func_75094_b()) * 2.8);

    unpressAllMovementKeys()
    setVelocity(0, Player.getPlayer().field_70181_x, 0)

    const onGround = Player.getPlayer().field_70122_E
    if (onGround) {
        jump()
    }

    Client.scheduleTask(onGround ? 3 : 1, () => {
        Player.getPlayer().field_70159_w = -Math.sin((direction) * Math.PI / 180) * speed
        Player.getPlayer().field_70179_y = Math.cos((direction) * Math.PI / 180) * speed
        pressAllPressedMovementKeys()
    })
}

export function setVelocity(x, y, z) {
    Player.getPlayer().func_70016_h(x, y, z);
}

export function unpressAllMovementKeys() {
    keybinds.forEach(keybind => KeyBinding.func_74510_a(keybind, false))
}

export function pressAllPressedMovementKeys() {
    keybinds.forEach(keybind => KeyBinding.func_74510_a(keybind, Keyboard.isKeyDown(keybind))) // Press down all keys that are physically pressed
}

let toggled = false
let currDepth = 20

export function lavaclip(distance) {
    if (toggled) {
        toggled = false
        vclip.unregister()
        vclipOverlay.unregister()
        return
    }
    if (isNaN(distance)) {
        chat("please use a number")
        return
    }
    if (distance < 80.1 && distance > 3) {
        currDepth = distance
        toggled = true
        vclip.register()
        vclipOverlay.register()

    } else {
        chat("Distance has to be between 40 and 3")
    }
}

const vclipOverlay = register("renderOverlay", () => {
    if (!toggled) return
    let text = "Dirty Cheater!"
    let scale = 1.5
    Renderer.scale(scale)
    Renderer.drawStringWithShadow(text, (Renderer.screen.getWidth() / scale - Renderer.getStringWidth(text)) / 2, Renderer.screen.getHeight() / scale / 2 + 16)
}).unregister()

const vclip = register("tick", () => {
    if (!Player.getPlayer().func_180799_ab()) return
    veloPacket.register()
    Player.getPlayer().func_70107_b(Player.getX(), Player.getY() - currDepth, Player.getZ())
}).unregister();

const veloPacket = register("packetReceived", (packet, event) => {
    if (!toggled) return
    if (Player.getPlayer().func_145782_y() !== packet.func_149412_c()) return;
    chat(packet.func_149410_e())
    if (packet.func_149410_e() !== 28000) return;
    cancel(event)
    veloPacket.unregister()
    vclip.unregister();
    vclipOverlay.unregister()
    toggled = false
}).setFilteredClass(S12PacketEntityVelocity).unregister()

register("Command", () => {
    toggled = false
    vclip.unregister()
    vclipOverlay.unregister()
}).setName("noclip")

export function getIdOfBlock(x, y, z) {
    return World.getBlockAt(x, y, z).type.getID()
}

let yawPitchRender = false

const mc = Client.getMinecraft().func_175598_ae()

const yawPitchOverlay = register("renderOverlay", () => {
    if (!yawPitchRender) return
    let freeCamYaw = (mc.field_78735_i % 360)

    if (freeCamYaw < -180) {
        freeCamYaw += 360
    }

    let text = freeCamYaw.toFixed(4) + ", " + mc.field_78732_j.toFixed(4)
    let scale = 1.5
    Renderer.scale(scale)
    Renderer.drawStringWithShadow(text, (Renderer.screen.getWidth() / scale - Renderer.getStringWidth(text)) / 2, Renderer.screen.getHeight() / scale / 2 + 16)
}).unregister()

register("command", () => {
    if (!yawPitchRender) {
        yawPitchRender = true
        yawPitchOverlay.register()
    } else {
        yawPitchRender = false
        yawPitchOverlay.unregister()
    }
}).setName("showyaw")