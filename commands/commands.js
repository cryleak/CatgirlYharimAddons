import ServerRotations from "../utils/ServerRotations"
import { rightClick, chat } from "../utils/utils"

const S08PacketPlayerPosLook = Java.type("net.minecraft.network.play.server.S08PacketPlayerPosLook")
const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");


const keybinds = [
    Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74370_x.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74366_z.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74368_y.func_151463_i()
];

register("Command", () => {
    let speed = ((Player.getPlayer().field_71075_bZ.func_75094_b()) * 2.8);
    let yaw = (Player.getYaw()) * Math.PI / 180;

    keybinds.forEach(keybind => KeyBinding.func_74510_a(keybind, false)) // Release all keybinds
    Player.getPlayer().func_70016_h(0, Player.getPlayer().field_70181_x, 0);

    Client.scheduleTask(0, () => {
        Player.getPlayer().func_70016_h(-Math.sin(yaw) * speed, Player.getPlayer().field_70181_x, Math.cos(yaw) * speed);
        keybinds.forEach(keybind => KeyBinding.func_74510_a(keybind, Keyboard.isKeyDown(keybind))) // Press down all keys that are physically pressed
    })
}).setName("hclip")

register("Command", (distance) => {
    if (isNaN(distance) && !distance) {
        chat("Invalid number.")
        return
    }
    let yaw = (Player.getYaw()) * Math.PI / 180;
    Player.getPlayer().func_70107_b(Player.getX() - Math.sin(yaw) * distance, Player.getY(), Player.getZ() + Math.cos(yaw) * distance)
}).setName("clip")

let distance = 0

const doShit = (targetItemName) => {
    leapSlot = Player.getInventory().getItems().findIndex(a => a?.getName()?.removeFormatting() === targetItemName)
    if (leapSlot > 7 || leapSlot < 0) { chat(`${targetItemName} Not Found in Hotbar`); return }
    else {
        Player.setHeldItemIndex(leapSlot)
        ServerRotations.set(Player.getYaw(), 90)
        Client.scheduleTask(() => {
            rightClick()
            ServerRotations.resetRotations()
        })
    }
}

register("Command", (y) => {
    if (isNaN(y)) { chat("Please use a number."); return }
    if (Math.abs(y) < 40.1 && Math.abs(y) > 3) {
        distance = Math.abs(y)
        pearlclip.register()
        doShit("Ender Pearl")
    } else chat("Distance has to be between 40 and 3.")
}).setName("pearlclip")

register("Command", () => {
    pearlclip.unregister()
}).setName("nopearlclip")

const pearlclip = register("packetReceived", (packet) => {
    Client.scheduleTask(() => { Player.getPlayer().func_70107_b(Math.floor(Player.getX()) + 0.5, Math.floor(Player.getY()) - distance, Math.floor(Player.getZ()) + 0.5) })
    pearlclip.unregister()
    chat("Pearlclip go!")
}).setFilteredClass(S08PacketPlayerPosLook).unregister()