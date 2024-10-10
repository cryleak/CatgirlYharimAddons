import { Keybind } from "../../../KeybindFix"
import Settings from "../../config"

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")

awaitingPet = false;
inMenu = false

register("packetReceived", () => {
    if (!awaitingPet) return
    awaitingPet = false
    Client.scheduleTask(() => {
        //if (Player.getContainer().getName() !== "Pets (1/2)") return
        Client.getMinecraft().func_147108_a(null)
    })
    Client.scheduleTask(1, () => {
        //if (Player.getContainer().getName() !== "Pets (1/2)") return
        Player.getContainer().click(itemIndex)
    })
}).setFilteredClass(S2DPacketOpenWindow)


new Keybind("Swap to Pet #1", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    ChatLib.command("pets")
    itemIndex = Settings().petOne
    awaitingPet = true;
});

new Keybind("Swap to Pet #2", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    ChatLib.command("pets")
    itemIndex = Settings().petTwo
    awaitingPet = true;
});

new Keybind("Swap to Pet #3", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    ChatLib.command("pets")
    itemIndex = Settings().petThree
    awaitingPet = true;
});

new Keybind("Swap to Pet #4", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    ChatLib.command("pets")
    itemIndex = Settings().petFour
    awaitingPet = true;
});

new Keybind("Swap to Pet #5", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    ChatLib.command("pets")
    itemIndex = Settings().petFive
    awaitingPet = true;
});
