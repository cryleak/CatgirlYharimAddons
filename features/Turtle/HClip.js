import { Keybind } from "../../../KeybindFix"

new Keybind("HClip", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    ChatLib.command("hclip", true)
});