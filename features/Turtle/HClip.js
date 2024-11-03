import { jump } from "../../utils/AutoP3Utils";
import fakeKeybinds from "../../utils/fakeKeybind"
import { pressAllPressedMovementKeys, slingshot, unpressAllMovementKeys, setVelocity } from "../../utils/utils";

fakeKeybinds.onKeyPress("hclipKeybind", () => {
    const speed = Player.getPlayer().field_71075_bZ.func_75094_b() * 2.8
    const onGround = Player.getPlayer().field_70122_E
    if (onGround) {
        jump()
    }

    unpressAllMovementKeys()
    setVelocity(0, Player.getPlayer().field_70181_x, 0)

    Client.scheduleTask(0, () => {
        Player.getPlayer().field_70159_w = -Math.sin((Player.getYaw()) * Math.PI / 180) * speed
        Player.getPlayer().field_70179_y = Math.cos((Player.getYaw()) * Math.PI / 180) * speed
        pressAllPressedMovementKeys()
    })
})