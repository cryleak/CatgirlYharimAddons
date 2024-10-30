import Settings from "../config"

const fakeKeybinds = []

function onKeyPress(varName, code) {
    keyListener.register()
    fakeKeybinds.push({ keybindName: varName, exec: code })
}

export default { onKeyPress }

const keyListener = register(net.minecraftforge.fml.common.gameevent.InputEvent.KeyInputEvent, () => {
    if (Client.isInGui() || !World.isLoaded()) return
    if (!Keyboard.getEventKeyState()) return
    const keyCode = Keyboard.getEventKey()
    if (!keyCode) return

    const settings = Settings()
    const pressedKeybind = fakeKeybinds.find(key => settings[key.keybindName] === keyCode)
    if (!pressedKeybind) return

    pressedKeybind.exec() // Execute the code associated with the pressed keybind
}).unregister()