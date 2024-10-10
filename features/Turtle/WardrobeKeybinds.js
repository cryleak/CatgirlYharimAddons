import { Keybind } from "../../../KeybindFix"
const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding")

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")

awaitingPet = false;

register("packetReceived", () => {
    if (!awaitingPet) return
    awaitingPet = false
    Client.scheduleTask(() => {
        if (Player.getContainer().getName() !== "Wardrobe (1/2)") return
        Client.getMinecraft().func_147108_a(null)
    })
    Client.scheduleTask(1, () => {
        if (Player.getContainer().getName() !== "Wardrobe (1/2)") return
        const item = itemIndex
        Player.getContainer().click(item)
    })
    Client.scheduleTask(2, () => {
        Client.currentGui.close()
    })
}).setFilteredClass(S2DPacketOpenWindow)


new Keybind("Swap to Armor #1", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    ChatLib.command("wd")
    itemIndex = 36
    awaitingPet = true;
});

new Keybind("Swap to Armor #2", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    ChatLib.command("wd")
    itemIndex = 37
    awaitingPet = true;
});

new Keybind("Swap to Armor #3", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    ChatLib.command("wd")
    itemIndex = 38
    awaitingPet = true;
});

new Keybind("Swap to Armor #4", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    ChatLib.command("wd")
    itemIndex = 39
    awaitingPet = true;
});

new Keybind("Swap to Armor #5", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    ChatLib.command("wd")
    itemIndex = 40
    awaitingPet = true;
});

new Keybind("Swap to Armor #6", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    ChatLib.command("wd")
    itemIndex = 41
    awaitingPet = true;
});

new Keybind("Swap to Armor #7", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    ChatLib.command("wd")
    itemIndex = 42
    awaitingPet = true;
});

new Keybind("Swap to Armor #8", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    ChatLib.command("wd")
    itemIndex = 43
    awaitingPet = true;
});

new Keybind("Swap to Armor #9", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    ChatLib.command("wd")
    itemIndex = 44
    awaitingPet = true;
})
