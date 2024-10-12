import Settings from "../../config";

hclipCooldown = false

register("Tick", () => {
    if (Client.isInGui()) return
    if (!Keyboard.isKeyDown(Settings().hclipKeybind)) return
    if (hclipCooldown) return
    hclipCooldown = true
    ChatLib.command("hclip", true)
    Client.scheduleTask(4, () => {
        hclipCooldown = false
    })
})