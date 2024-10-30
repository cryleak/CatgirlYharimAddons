import Settings from "../../config";
import fakeKeybinds from "../../utils/fakeKeybind"
import { slingshot } from "../../utils/utils";

hclipCooldown = false

fakeKeybinds.onKeyPress("hclipKeybind", () => {
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