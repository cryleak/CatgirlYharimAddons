export const soundNames = ["note.pling", "mob.blaze.hit", "fire.ignite", "random.orb", "mob.cat.meow"]

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
    itemSlot = Player.getInventory().getItems().findIndex(a => a?.getName()?.includes(targetItemName))
    if (itemSlot > 7 || itemSlot < 0) { chat(`${targetItemName} Not Found in Hotbar`); return } else {
        heldItem = Player.getHeldItemIndex()
        Player.setHeldItemIndex(itemSlot)
    }
}

export function block(x, y, z) {
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

    rotate(yaw, pitch)
}

const defaultColor = "§7"
export function chat(message) {
    ChatLib.chat("§0[§6Yharim§0] " + defaultColor + message.toString().replaceAll("§r", defaultColor))
}



const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");
const movementKeys = [
    Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74370_x.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74366_z.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74368_y.func_151463_i()
]
export const releaseMovementKeys = () => movementKeys.forEach(keybind => KeyBinding.func_74510_a(keybind, false))
export const repressMovementKeys = () => movementKeys.forEach(keybind => KeyBinding.func_74510_a(keybind, Keyboard.isKeyDown(keybind)))