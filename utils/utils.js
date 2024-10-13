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
    itemSlot = Player.getInventory().getItems().findIndex(a => a?.getName()?.toLowerCase()?.includes(targetItemName.toLowerCase()))
    if (itemSlot > 7 || itemSlot < 0) { chat(`${targetItemName} Not Found in Hotbar`); throw new ReferenceError(`Unable to find "${targetItemName}" in your hotbar`) } else { // Throw error in order to stop execution of the code below it because it will be completely fucked probably
        heldItem = Player.getHeldItemIndex()
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
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
let awaitingLeap = false

export function leap(player) {
    swapToItem("Leap")
    Client.scheduleTask(0, () => rightClick())
    awaitingLeap = true

    register("packetReceived", () => {
        if (!awaitingLeap) return
        awaitingLeap = false
        Client.scheduleTask(0, () => {
            if (Player.getContainer().getName() !== "Spirit Leap") return
            let playerName
            if (classes.includes(player)) { // (Hopefully) detect if you are trying to leap to a class
                const teamMembers = Dungeons.getTeamMembers()
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

let awaitingPet = false

export function equipPet(petIndex) {
    if (!petIndex) {
        chat("Index not defined")
        return
    }
    ChatLib.command("pets")
    awaitingPet = true
    register("packetReceived", () => {
        if (!awaitingPet) return
        awaitingPet = false
        Client.scheduleTask(() => {
            Client.getMinecraft().func_147108_a(null)
        })
        Client.scheduleTask(1, () => {
            Player.getContainer().click(petIndex)
        })
    }).setFilteredClass(S2DPacketOpenWindow)
}

let awaitingWardrobe = false

export function equipWardrobe(index) {
    ChatLib.command("wardrobe")
    awaitingWardrobe = true
    register("packetReceived", () => {
        if (!awaitingWardrobe) return
        awaitingWardrobe = false
        Client.scheduleTask(() => {
            if (Player.getContainer().getName() !== "Wardrobe (1/2)") return
            Client.getMinecraft().func_147108_a(null)
        })
        Client.scheduleTask(1, () => {
            if (Player.getContainer().getName() !== "Wardrobe (1/2)") return
            Player.getContainer().click(index)
        })
        Client.scheduleTask(3, () => {
            Client.currentGui.close()
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
    let speed = ((Player.getPlayer().field_71075_bZ.func_75094_b()) * 2.8);
    let yaw = (direction) * Math.PI / 180;

    keybinds.forEach(keybind => KeyBinding.func_74510_a(keybind, false)) // Release all keybinds
    Player.getPlayer().func_70016_h(0, Player.getPlayer().field_70181_x, 0);

    Client.scheduleTask(0, () => {
        Player.getPlayer().func_70016_h(-Math.sin(yaw) * speed, Player.getPlayer().field_70181_x, Math.cos(yaw) * speed);
        keybinds.forEach(keybind => KeyBinding.func_74510_a(keybind, Keyboard.isKeyDown(keybind))) // Press down all keys that are physically pressed
    })
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
    if (distance < 40.1 && distance > 3) {
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

register("Command", () => {
    toggled = false
    vclip.unregister()
    vclipOverlay.unregister()
}).setName("noclip")
