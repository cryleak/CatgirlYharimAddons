import Settings from "../../config";
import { slingshot } from "../../utils/utils";

hclipCooldown = false

register("Tick", () => {
    if (Client.isInGui()) return
    if (!Keyboard.isKeyDown(Settings().hclipKeybind)) return
    if (hclipCooldown) return
    hclipCooldown = true
    slingshot(Player.getYaw())
    Client.scheduleTask(4, () => {
        hclipCooldown = false
    })
})

register("command", (direction) => {
    slingshot(direction)
}).setName("hclip")