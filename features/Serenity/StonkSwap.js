import { chat,leftClick } from "../../utils/utils"
import Settings from "../../config"

let active = false
const validPickaxeIDs = [278, 285, 257, 274, 270] // All 5 pickaxes
const validSwapIDS = [267, 277, 369] // iron sword, diamond shovel, blaze rod

register("tick", () => {
    if (Client.isInGui()) return
    if (!Keyboard.isKeyDown(Settings().stonkSwap) || active) return
    active = true
    const pickaxeSlot = Player.getInventory().getItems().findIndex(item => validPickaxeIDs.includes(item?.getID()))
    const swapSlot = Player.getInventory().getItems().findIndex(item => validSwapIDS.includes(item?.getID()))

    if (!isInHotbar(pickaxeSlot)) {
        chat("Pickaxe not found in your hotbar!")
        Client.scheduleTask(2, () => { active = false })
        return
    } else if (!isInHotbar(swapSlot)) {
        chat("No suitable item found to swap to in your hotbar!")
        Client.scheduleTask(2, () => { active = false })
        return
    }
    Player.setHeldItemIndex(swapSlot)
    Client.scheduleTask(0, () => {
        Player.setHeldItemIndex(pickaxeSlot)
        leftClick()
    })
    Client.scheduleTask(2, () => { active = false })
})

const isInHotbar = (item) => { return (item < 8 && item >= 0) }