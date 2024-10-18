import Settings from "../../config"
import { equipPet } from "../../utils/utils"

let petCooldown = false

function pet() {
    petCooldown = true
    Client.scheduleTask(19, () => { petCooldown = false })
}

register("Tick", () => {
    if (Client.isInGui()) return
    if (petCooldown) return
    if (Keyboard.isKeyDown(Settings().petOneKeybind)) { equipPet(Settings().petOne); pet() }
    if (Keyboard.isKeyDown(Settings().petTwoKeybind)) { equipPet(Settings().petTwo); pet() }
    if (Keyboard.isKeyDown(Settings().petThreeKeybind)) { equipPet(Settings().petThree); pet() }
    if (Keyboard.isKeyDown(Settings().petFourKeybind)) { equipPet(Settings().petFour); pet() }
    if (Keyboard.isKeyDown(Settings().petFiveKeybind)) { equipPet(Settings().petFive); pet() }
})