import Settings from "../../config"
import { equipWardrobe } from "../../utils/utils"

let wardrobeCooldown = false

function wardrobe() {
    wardrobeCooldown = true
    Client.scheduleTask(19, () => { wardrobeCooldown = false })
}

register("Tick", () => {
    if (Client.isInGui()) return
    if (wardrobeCooldown) return
    if (Keyboard.isKeyDown(Settings().wdOneKeybind)) { wardrobe(); equipWardrobe(36) }
    if (Keyboard.isKeyDown(Settings().wdTwoKeybind)) { wardrobe(); equipWardrobe(37) }
    if (Keyboard.isKeyDown(Settings().wdThreeKeybind)) { wardrobe(); equipWardrobe(38) }
    if (Keyboard.isKeyDown(Settings().wdFourKeybind)) { wardrobe(); equipWardrobe(39) }
    if (Keyboard.isKeyDown(Settings().wdFiveKeybind)) { wardrobe(); equipWardrobe(40) }
    if (Keyboard.isKeyDown(Settings().wdSixKeybind)) { wardrobe(); equipWardrobe(41) }
    if (Keyboard.isKeyDown(Settings().wdSevenKeybind)) { wardrobe(); equipWardrobe(42) }
    if (Keyboard.isKeyDown(Settings().wdEightKeybind)) { wardrobe(); equipWardrobe(43) }
    if (Keyboard.isKeyDown(Settings().wdNineKeybind)) { wardrobe(); equipWardrobe(44) }
})