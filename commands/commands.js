import ServerRotations from "../utils/ServerRotations"
import { rightClick, chat } from "../utils/utils"

const S08PacketPlayerPosLook = Java.type("net.minecraft.network.play.server.S08PacketPlayerPosLook")

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